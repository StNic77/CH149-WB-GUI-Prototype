/* A common visual plane carries both the original raster and its navigation target. */
(() => {
  const registration = window.CH149_PLAN_REGISTRATION;
  const viewport = document.getElementById('planViewport');
  const sheet = document.getElementById('planSheet');
  const image = document.getElementById('cabinImage');
  const target = document.getElementById('planCabinet');
  const main = document.getElementById('cabinMain');
  const tools = document.getElementById('planTools');
  const zoomOutput = document.getElementById('planZoomValue');
  const guideLayer = document.getElementById('planGuides');
  let isPlan = true, zoom = 1, panX = 0, panY = 0, dragging = null, activeAsset = null;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  function paint() {
    panX = clamp(panX, 1 - zoom, 0); panY = clamp(panY, 1 - zoom, 0);
    sheet.style.transform = isPlan ? `translate(${panX*viewport.clientWidth}px,${panY*viewport.clientHeight}px) scale(${zoom})` : '';
    zoomOutput.value = Math.round(zoom*100) + '%';
    document.getElementById('planZoomOut').disabled = zoom <= 1;
    document.getElementById('planZoomIn').disabled = zoom >= 4;
    viewport.classList.toggle('can-pan', isPlan && zoom > 1);
  }
  function changeZoom(next, anchorX=.5, anchorY=.5) {
    next = clamp(next, 1, 4);
    panX = anchorX - (anchorX-panX)*next/zoom;
    panY = anchorY - (anchorY-panY)*next/zoom;
    zoom = next; paint();
  }
  function fit() { zoom=1;panX=panY=0;paint(); }
  const percent = (value,total) => (value/total*100)+'%';
  function setView({ view, preset, hasPlan, cabinetInstalled }) {
    isPlan = view === 'plan';
    tools.hidden = !isPlan || !hasPlan;
    viewport.classList.toggle('is-plan', isPlan);
    viewport.setAttribute('tabindex', isPlan && hasPlan ? '0' : '-1');
    activeAsset = isPlan ? registration.assets[preset || 'BASELINE'] : null;
    image.removeAttribute('style'); target.removeAttribute('style');
    image.hidden = isPlan && !hasPlan;
    viewport.hidden = isPlan && !hasPlan;
    if (isPlan && hasPlan && activeAsset) {
      const asset = activeAsset;
      image.style.left = percent(asset.x,registration.width);
      image.style.top = percent(asset.y,registration.height);
      image.style.width = percent(asset.size[0]*asset.scale,registration.width);
      image.style.height = 'auto';
      if (cabinetInstalled && asset.cabinet) {
        const [x,y,w,h] = asset.cabinet;
        target.style.left = percent(asset.x+x*asset.scale,registration.width);
        target.style.top = percent(asset.y+y*asset.scale,registration.height);
        target.style.width = percent(w*asset.scale,registration.width);
        target.style.height = percent(h*asset.scale,registration.height);
      } else target.classList.remove('show');
    }
    guideLayer.toggleAttribute('hidden', !isPlan || !document.getElementById('planGuideToggle').checked);
    window.CabinBayLayer.setView({asset:activeAsset,available:isPlan && hasPlan && !!activeAsset});
    window.CabinSeatEditor.setView(isPlan && hasPlan && !!activeAsset);
    window.CabinCabinetZones.setView(view);
    window.CabinForwardShelves?.setView(view);
    window.CabinRampShelves?.setView(view);
    window.CabinPortOverhead?.setView(view);
    window.CabinStbdOverhead?.setView(view);
    window.CabinFloorArea?.setView(isPlan && hasPlan && !!activeAsset);
    window.CabinBasket?.setView(isPlan && hasPlan && !!activeAsset);
    window.CabinPTA?.setView(view,isPlan && hasPlan && !!activeAsset);
    window.CabinStokes?.setView(view,isPlan && hasPlan && !!activeAsset);
    window.CabinLive?.setView(view,isPlan && hasPlan && !!activeAsset);
    window.CabinRampArea?.setView(isPlan && hasPlan && !!activeAsset);
    window.CabinFloorEquipment?.setView(view);
    window.CabinCasevac?.setView(view);
    paint();
  }
  const guide = registration.guides;
  guideLayer.setAttribute('viewBox',`0 0 ${registration.width} ${registration.height}`);
  guideLayer.innerHTML = `<g><path d="M${guide.noseX} 0V1216 M${guide.cockpitAftX} 0V1216 M${guide.hingeX} 0V1216 M0 ${guide.centerY}H2560"/><text x="${guide.noseX+12}" y="100">Nose</text><text x="${guide.cockpitAftX+12}" y="100">Cockpit seam</text><text x="${guide.hingeX+12}" y="100">Ramp hinge</text></g>`;
  document.getElementById('planZoomIn').onclick = () => changeZoom(zoom+.5);
  document.getElementById('planZoomOut').onclick = () => changeZoom(zoom-.5);
  document.getElementById('planFit').onclick = fit;
  document.getElementById('planGuideToggle').onchange = event => { guideLayer.toggleAttribute('hidden', !event.target.checked); };
  document.getElementById('planWide').onclick = event => {
    const expanded = main.classList.toggle('plan-expanded');
    event.currentTarget.setAttribute('aria-pressed', String(expanded));
    event.currentTarget.textContent = expanded ? 'Show contents' : 'Wide view';
  };
  let suppressClick = false;
  viewport.parentElement.addEventListener('click', event => {
    if (suppressClick) {suppressClick=false;event.preventDefault();event.stopImmediatePropagation();}
  }, true);
  viewport.addEventListener('pointerdown', event => {
    suppressClick=false;
    if (!isPlan || zoom<=1 || event.target.closest('#planCabinet') || (event.pointerType==='mouse' && event.button!==0)) return;
    dragging = { id:event.pointerId, x:event.clientX, y:event.clientY, panX, panY };
  });
  viewport.addEventListener('pointermove', event => {
    if (!dragging || dragging.id!==event.pointerId) return;
    if (!dragging.moved && Math.hypot(event.clientX-dragging.x,event.clientY-dragging.y)<7) return;
    dragging.moved=true; suppressClick=true;
    viewport.setPointerCapture(event.pointerId);viewport.classList.add('panning');event.preventDefault();
    panX = dragging.panX+(event.clientX-dragging.x)/viewport.clientWidth;
    panY = dragging.panY+(event.clientY-dragging.y)/viewport.clientHeight;paint();
  });
  for (const event of ['pointerup','pointercancel','lostpointercapture']) viewport.addEventListener(event, () => { dragging=null;viewport.classList.remove('panning'); });
  viewport.addEventListener('keydown', event => {
    if (!isPlan || event.target!==viewport) return;
    if (event.key==='+' || event.key==='=') changeZoom(zoom+.5);
    else if (event.key==='-') changeZoom(zoom-.5);
    else if (event.key==='Home') fit();
    else if (event.key==='ArrowLeft') {panX+=.08;paint();}
    else if (event.key==='ArrowRight') {panX-=.08;paint();}
    else if (event.key==='ArrowUp') {panY+=.08;paint();}
    else if (event.key==='ArrowDown') {panY-=.08;paint();}
    else return;
    event.preventDefault();
  });
  new ResizeObserver(paint).observe(viewport);
  window.CabinPlanViewer = { setView, fit, getState:() => ({zoom,panX,panY,asset:activeAsset}) };
})();
