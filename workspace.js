/* Navigation preview only. Deliberately does not load Active Dev or write storage. */
(() => {
  const stages = {
    aircraft: {
      eyebrow: '01 / ESTABLISH THE STARTING POINT', title: 'Begin with the aircraft.',
      description: 'Aircraft identity, accepted starting data and the equipment already accounted for.',
      cards: [
        ['Aircraft & session', 'Choose the aircraft before preparing its load. Keep each aircraft’s session separate.',
          [['Aircraft / SIM / IPT', 'Not selected'], ['Session lifecycle', 'Select · return · end'], ['Saved session', 'Not connected']]],
        ['Accept aircraft data', 'Keep the starting weight basis explicit so installed equipment is counted correctly.',
          [['Basic weight & CG', 'Awaiting accepted data'], ['Weight basis', 'Maintenance / RFM'], ['Baseline & exceptions', 'Review before acceptance'], ['Reference document', 'Source and revision']]]
      ], next: ['Explore cabin setup', 'cabin']
    },
    cabin: { eyebrow: '02 / PREPARE THE CABIN', title: 'A clear view of your aircraft.',
      description: 'Choose a role, explore the cabin and inspect its equipment.' },
    balance: {
      eyebrow: '03 / REVIEW THE WHOLE LOAD', title: 'Every change, in balance.',
      description: 'Bring fuel, cabin loads and the predicted CG path into one review.',
      cards: [
        ['Fuel planning', 'Retain the app’s tank allocation, landing fuel and burn calculations.',
          [['Total fuel', 'Not calculated'], ['Tank distribution', 'Automatic / manual'], ['Landing fuel', 'Not calculated']]],
        ['Weight & balance', 'The existing engine will supply these results from the same aircraft session used by the cabin.',
          [['Operating weight & CG', 'Not calculated'], ['All-up weight & CG', 'Not calculated'], ['Envelope & CG path', 'Engine connection required'], ['Load limits & issues', 'Not evaluated']]],
        ['Load planning', 'Preserve cargo entries, tactical bay loads, shelf capacities and their separate accounting.',
          [['Cabin bays & ramp', 'Not connected'], ['Cargo entries & shelf loads', 'Not connected']]],
        ['MCDU load summary', 'Present cargo and cabin menu values from the established app logic.',
          [['Cargo menu', 'Not calculated'], ['Cabin / AMS cabin menu', 'Not calculated']]]
      ], next: ['Explore completion', 'complete']
    },
    complete: {
      eyebrow: '04 / REVIEW AND COMPLETE', title: 'A clear finish to preparation.',
      description: 'Cross-check the aircraft entries and retain the complete flight record.',
      cards: [
        ['MCDU cross-check', 'Keep expected values and read-back values together, with any discrepancy visible.',
          [['Expected AUW / CG / fuel', 'Engine connection required'], ['Read-back values', 'Not entered'], ['Cross-check result', 'Not evaluated']]],
        ['Sign & flight record', 'Carry over certification conditions, sign-out and the existing report content.',
          [['Required reviews', 'Not evaluated'], ['Certification', 'Unavailable in prototype'], ['PDF report', 'Not connected'], ['Session save / restore', 'Not connected']]]
      ], next: ['Return to cabin', 'cabin']
    },
    manage: {
      eyebrow: 'CONFIGURATION / FLEET TOOLS', title: 'Keep the aircraft data traceable.',
      description: 'A separate home for the existing custodian tools and configuration lifecycle.',
      cards: [
        ['Equipment & locations', 'Retain the controlled editor workflow and its dependency checks.',
          [['Role-fit & mission catalogues', 'Editor connection required'], ['Stowage & seat baselines', 'Editor connection required'], ['Patient positions & references', 'Preserve existing coverage']]],
        ['Configurations & releases', 'Support fleet and tail-specific data without changing another aircraft’s setup.',
          [['Role configurations', 'Create · edit · retire'], ['Fleet / tail overrides', 'Not connected'], ['Configuration export & recovery', 'Not connected'], ['Offline release readiness', 'Not connected']]]
      ], next: ['Return to cabin', 'cabin']
    }
  };
  const heading = document.getElementById('workspaceHeading');
  const preview = document.getElementById('stagePreview');
  function openStage(key, focus = true) {
    const stage = stages[key];
    if (!stage) return;
    document.querySelectorAll('[data-stage]').forEach(button => {
      if (button.dataset.stage === key) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('workspaceEyebrow').textContent = stage.eyebrow;
    heading.textContent = stage.title;
    document.getElementById('workspaceDescription').textContent = stage.description;
    document.getElementById('workflowStatus').textContent = key === 'cabin' ? 'Cabin interaction concept' : 'Screen design preview';
    document.getElementById('cabinWorkspace').hidden = key !== 'cabin';
    preview.hidden = key === 'cabin';
    if (stage.cards) {
      // All strings below are local design copy, not configuration or user data.
      preview.innerHTML = '<div class="stage-banner"><div><b>Screen design preview</b>This section shows the proposed workflow. Data entry and operational actions will become available as the existing app logic is connected.</div></div><div class="stage-grid">' +
        stage.cards.map(([title, description, rows], index) => `<article class="design-card"><span class="card-kicker">${String(index + 1).padStart(2, '0')} / ${key === 'manage' ? 'CUSTODIAN' : 'FLIGHT PREPARATION'}</span><h3>${title}</h3><p>${description}</p>${rows.map(([label, value]) => `<div class="design-row"><span>${label}</span><span>${value}</span></div>`).join('')}</article>`).join('') +
        `</div><div class="stage-next"><span>Explore the complete workflow · cabin edits stay in this session as you navigate.</span><button id="stageNext">${stage.next[0]} <span aria-hidden="true">→</span></button></div>`;
      document.getElementById('stageNext').onclick = () => openStage(stage.next[1]);
    }
    if (focus) heading.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-stage]').forEach(button => {
    button.addEventListener('click', () => openStage(button.dataset.stage));
  });
  openStage('cabin', false);
})();
