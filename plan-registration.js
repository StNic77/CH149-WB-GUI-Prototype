/* Visual registration only: source pixels are never aircraft stations or W&B arms. */
window.CH149_PLAN_REGISTRATION = (() => {
  const width = 2560, height = 1216;
  // SAR-10 is the framing reference. A 90%-wide aircraft leaves consistent margins.
  const referenceScale = 2304 / (1545 - 83);
  const referenceHinge = 128 + (1174 - 83) * referenceScale;
  const specs = {
    BASELINE: { file: 'images/unconfigured-baseline-v2.png', size: [1864,843], nose: [290,404], hingeX: 1206, cockpitAftX: 537, tailX: 1520 },
    SAR3: { file: 'images/SAR_3_Pax_clean.png', size: [1864,843], nose: [291,403], hingeX: 1207, cockpitAftX: 537, tailX: 1518, cabinet: [640,313,133,60] },
    SAR10: { file: 'images/SAR_10_Pax_clean.png', size: [1819,865], nose: [83,421], hingeX: 1174, cockpitAftX: 385, tailX: 1545, cabinet: [512,313,142,71] },
    TRANSPORT: { file: 'images/Transport_clean.png', size: [1883,835], nose: [214,452], hingeX: 1288, cockpitAftX: 514, tailX: 1655 },
    CASEVAC: { file: 'images/CASEVAC_clean.png', size: [1918,820], nose: [257,398], hingeX: 1268, cockpitAftX: 540, tailX: 1615 }
  };
  const assets = {};
  for (const [key, spec] of Object.entries(specs)) {
    const scale = (referenceHinge - 128) / (spec.hingeX - spec.nose[0]);
    assets[key] = { ...spec, scale, x: 128 - spec.nose[0] * scale, y: height / 2 - spec.nose[1] * scale };
  }
  return { width, height, reference: 'SAR10', assets, guides: { noseX:128, cockpitAftX:128+(385-83)*referenceScale, hingeX:referenceHinge, centerY:height/2 },
    provenance: 'Manually identified render landmarks and read-only silhouette checks. Uniform scale/translation; no stretching, regeneration or aircraft-geometry claim.' };
})();
