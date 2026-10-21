(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const source = 'images/SAR_3_Pax.png';
  let review = { schema: 1, source, nextNumber: 1, selected: null, markers: [] };
  let history = [], timer, revision = 0, savedRevision = 0, inFlight = false, ready = false;
  const kinds = ['unknown', 'equipment', 'structure', 'location'];
  const decisions = ['unreviewed', 'keep', 'remove', 'location'];
  const copy = value => JSON.parse(JSON.stringify(value));
  const marker = () => review.markers.find(item => item.number === review.selected);
  function status(message, error = false) {
    $('saveStatus').textContent = message;
    $('saveStatus').dataset.error = String(error);
  }
  function remember() {
    history.push(copy(review));
    if (history.length > 50) history.shift();
    $('undoReview').disabled = false;
  }
  function changed() {
    revision++;
    status('Saving review…');
    clearTimeout(timer);
    timer = setTimeout(save, 250);
  }
  async function save() {
    if (inFlight || !ready || savedRevision === revision) return;
    inFlight = true;
    const sentRevision = revision;
    try {
      const response = await fetch('/api/review-markers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(review)
      });
      if (!response.ok) throw new Error('save');
      savedRevision = sentRevision;
      if (savedRevision === revision) status('Saved in prototype · ready to discuss');
      $('retrySave').hidden = true;
    } catch {
      status('Not saved. Keep this page open and retry.', true);
      $('retrySave').hidden = false;
    } finally {
      inFlight = false;
      if (savedRevision === sentRevision && revision !== sentRevision) save();
    }
  }
  function buttonFor(item, onImage) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.number;
    button.setAttribute('aria-label', `Marker ${item.number}: ${item.name || 'Not yet named'}`);
    button.setAttribute('aria-pressed', String(item.number === review.selected));
    if (onImage) {
      button.className = 'marker';
      button.style.left = item.x * 100 + '%';
      button.style.top = item.y * 100 + '%';
    }
    button.onclick = event => {
      event.stopPropagation(); review.selected = item.number; render(); changed();
      $('markerName').focus({ preventScroll: false });
    };
    return button;
  }
  function render() {
    $('markerLayer').replaceChildren(...review.markers.map(item => buttonFor(item, true)));
    $('markerList').replaceChildren(...review.markers.map(item => buttonFor(item, false)));
    $('markerCount').textContent = review.markers.length;
    const item = marker();
    $('markerEditor').hidden = !item;
    $('emptyReview').hidden = !!review.markers.length;
    if (!item) return;
    $('editorTitle').textContent = 'Marker ' + item.number;
    $('markerName').value = item.name;
    $('markerKind').value = item.kind;
    $('markerDecision').value = item.decision;
    $('markerNotes').value = item.notes;
    $('markerX').value = (item.x * 100).toFixed(1);
    $('markerY').value = (item.y * 100).toFixed(1);
  }
  function add(x, y) {
    if (!ready || review.markers.length >= 100) return;
    remember();
    const item = { number: review.nextNumber++, x, y, name: '', kind: 'unknown', decision: 'unreviewed', notes: '' };
    review.markers.push(item); review.selected = item.number; render(); changed();
    $('markerName').focus();
  }
  $('reviewImage').onclick = event => {
    const box = event.currentTarget.getBoundingClientRect();
    add((event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height);
  };
  $('addCenter').onclick = () => add(0.5, 0.5);
  $('markerEditor').onsubmit = event => event.preventDefault();
  for (const [id, key] of [['markerName', 'name'], ['markerKind', 'kind'], ['markerDecision', 'decision'], ['markerNotes', 'notes']]) {
    $(id).addEventListener('focus', () => { if (marker()) remember(); });
    $(id).addEventListener('input', () => {
      if (!marker()) return;
      marker()[key] = $(id).value;
      // Keep the field/caret in place while updating accessible marker names.
      document.querySelectorAll('#markerLayer button,#markerList button').forEach(button => {
        const item = review.markers.find(value => value.number === Number(button.textContent));
        button.setAttribute('aria-label', `Marker ${item.number}: ${item.name || 'Not yet named'}`);
      });
      changed();
    });
  }
  for (const [id, key] of [['markerX', 'x'], ['markerY', 'y']]) {
    $(id).onchange = () => {
      if (!marker()) return;
      const value = Number($(id).value);
      if (!Number.isFinite(value) || value < 0 || value > 100) { render(); return; }
      remember(); marker()[key] = value / 100; render(); changed();
    };
  }
  $('deleteMarker').onclick = () => {
    if (!marker()) return;
    remember(); review.markers = review.markers.filter(item => item.number !== review.selected);
    review.selected = review.markers.at(-1)?.number ?? null;
    render(); changed();
  };
  $('undoReview').onclick = () => {
    if (!history.length) return;
    review = history.pop(); render(); changed(); $('undoReview').disabled = !history.length;
  };
  $('retrySave').onclick = save;
  $('zoom').oninput = () => {
    $('imageCanvas').style.width = $('zoom').value + '%';
    $('zoomValue').value = $('zoom').value + '%';
  };
  window.addEventListener('beforeunload', event => {
    if (revision !== savedRevision) { event.preventDefault(); event.returnValue = ''; }
  });
  async function load() {
    try {
      const response = await fetch('/api/review-markers', { cache: 'no-store' });
      if (!response.ok) throw new Error('load');
      const data = await response.json();
      if (data.schema !== 1 || data.source !== source || !Array.isArray(data.markers) ||
          data.markers.some(item => !kinds.includes(item.kind) || !decisions.includes(item.decision))) throw new Error('format');
      review = data; ready = true; render();
      status(review.markers.length ? 'Saved review restored · ready to discuss' : 'Ready · click the image to begin');
    } catch {
      status('Review unavailable. Open this page through the prototype preview.', true);
      $('addCenter').disabled = true;
    }
  }
  load();
})();
