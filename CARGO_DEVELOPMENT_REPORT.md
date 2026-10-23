# Cargo layer and independent load entries

Implemented in the GUI prototype only. No product/data version numbers changed, and the operational W&B application was not modified.

## Root cause and reproduction

The reported storage overwrite was not reproduced in the inspected build. The original Add handler already appended to state.floorLoads with successive IDs. A baseline browser sequence of three cargo entries followed by two bay weights produced stored counts 1, 2, 3, 4, 5 and IDs [1,2,3,4,5]. However, each cell's load list filtered by the currently selected cell, so only that cell's record appeared after moving elsewhere. No aircraft-wide custom-load list or persistent installed-load symbols existed. The transient cargo-point marker represented the current draft only. Together, these display omissions made earlier loads appear replaced.

The correction retains the same authoritative state.floorLoads collection, supplies aircraft-wide visibility/selection, and centralizes add/edit/remove validation rather than introducing a second collection or clearing existing entries.

## Confirmed entry limits

The user clarified that the aircraft supports **four individual cargo entries**. Bay weights are separate: one entry per cabin bay (B1, B2, B3, B4, B5, B5.5, B6), plus one for the single ramp area. A bay entry is shared across that bay's Port/Centre/Stbd cells; selecting another cell in the same bay opens the existing entry for editing. Duplicate bay creation is rejected rather than overwriting it. Bay and ramp records do not consume individual cargo slots.

## Implementation

- cargo-layer.js owns validated operations over the existing collection. Entries retain unique IDs through edits and moves. Failed edits and cancelled point moves do not change records. IDs are checked against existing records even if the counter is stale. Installation state, location/arm and layer visibility are separate.
- Cargo is a separate, initially visible checkbox beside Seats and Live equipment. Individual cargo uses a single-box icon; bay/ramp weights use grouped boxes. Numbered symbols open their own record. Symbols are offset to avoid collisions; this is selection layout, not a change in physical location or load arm. The full Cargo & bay loads list supplies another path to every record.
- The inspector supports names, weights, location changes, entered arms or existing floor-point arm estimates for individual cargo, and fixed configured arms for bay/ramp weights. Individual point movement reuses floor-area.js placement mode; Escape cancels. Existing known-arm overrides remain explicit.
- A selected floor cell still lists its own loads, now with Edit / move and a link to all custom loads. Existing entries remain when adding either type or switching role/view/stage. Hiding Cargo changes the view only and also preserves unsaved inspector fields.
- Ramp supports individual cargo within the same four aircraft slots, plus its separate aggregate bay-weight entry. Individual cargo uses an estimated arm from its selected ramp position, with an optional known-arm override. Ramp bay weight uses the fixed REAR arm, 12893 mm. Ramp arms are restricted to the physical station bounds; combined loading warnings are now connected. Confirmed ramp bounds are X11393–X14393.

Bays Review labels all eight cabin boundaries and the aft ramp endpoint, alternating above and below the image: X4875, X5875, X6875, X7875, X8875, X9875, X10375, X11393 and X14393. The approved station calibration is unchanged.

## Calculation integrity

load-math.js pins the existing computeCargoTotals, computeBayTotals and cgFromMoment functions, unmodified, from the read-only reference compute.js, with a SHA256 provenance header. The adapter passes individual entries as s.cargo and bay/ramp weights as s.bays, using the prototype's established configured bay arms (including the user-approved B6=10875 mm).

All installed custom loads contribute once to the displayed weight, moment and load CG. Visibility is not an input to these functions. This is explicitly a **cargo/bay-load subtotal**, not whole-aircraft W&B: aircraft starting weight, equipment, people and fuel are not included. The existing full-aircraft engine remains unconnected; no second aircraft calculation system has been introduced. Ramp weight and hinge-moment warnings are connected separately; shelf limits and fit/clearance rules remain unfinished.

## Files

New: cargo-layer.js, cargo-layer.css, load-math.js, verification/cargo-layer-check.cjs and this report.

Integrated: floor-area.js (shared mutations, all-load access, bay reuse and relocation), index.html (state initialization, module loading/connection), plan-viewer.js and seat-editor.js (view/render lifecycle), ramp-area.js (ramp weight menu), package.json/.gitignore (portable regression check), README.md and DEMO_GUIDE.md. Changed cached loaders have new asset query markers; package/config versions are unchanged.

Local legacy floor tests were aligned to hide the new Cargo layer while testing floor targets, and the cabinet target test uses its intended reference-image mode. These scripts remain local; the new portable check is included in npm test.

## Verification

verification/cargo-layer-check.cjs passes at desktop, tablet portrait, tablet landscape and phone sizes, with actual mouse/emulated-touch selection. It verifies:

1. Three cargo plus two bay entries coexist with unique IDs and five symbols.
2. Co-located cargo symbols are independently selectable and the all-load list exposes every entry.
3. Layer hide/show preserves records and totals.
4. Editing Cargo B changes no other entry; removing Bay Weight A leaves the other four intact.
5. Bay relocation resolves the new configured arm; cargo floor-point relocation retains ID and updates the estimated arm, while cancelling preserves the original state.
6. The fifth cargo entry is rejected, bay duplicates are rejected, and four cargo plus all eight bay/ramp entries coexist (12 active records).
7. Total weight, moment and load CG equal independent expected sums after additions, edits, moves and removal. Pinned helper bodies match the reference source when available; protected source/data/image hashes remain unchanged.
8. View/stage/role navigation and Seats/Live equipment toggles preserve custom loads and symbols. Failed edits are atomic and stale counters cannot cause ID collisions.
9. Ramp cargo defaults to 12893 mm, accepts an entered arm, shares the four-slot cap and coexists with the ramp bay weight. Cabin/ramp relocation switches arm modes safely; new bay drafts retain the correct type. All nine station annotations use alternating top/bottom positions.
10. Resizing a 12-entry desktop setup to phone width reflows the symbols without overlap or horizontal page overflow. Hiding/restoring Cargo preserves unsaved inspector fields.

The portable npm test (existing demo, hosted/file calibration, cargo) passes. Existing floor-area-check.cjs and floor-cargo-arm-check.cjs pass their four-size scopes. Screenshots cargo-layer-preview.png and cargo-loads-preview.png were visually inspected. Touch testing is browser emulation, not physical-device validation.

## Remaining limits

Custom loads remain session-only; this work does not add save/restore across refresh or synchronize configurations between computers. Symbol offsets do not establish cargo dimensions or fit. Full-aircraft totals/approval require the planned engine integration. Ramp checks use the current Active Dev constants and hinge-moment proxy, rather than an independently derived operational limit curve. Fuel scope is unchanged and its visualization remains undecided pending suitable imagery.

## Ramp checks from Active Dev

The prototype reads the unchanged `config-data.js` AC_RAMP snapshot: hinge 11393 mm, end 14393 mm, closed load 350 kg, open load 450 kg and hingeMomentMax 450 kg·m. These match Active Dev `config.js`, section 4. Active Dev `app.js` ramp hints use weight × (arm − hinge) / 1000 and issue per-cargo warnings; its cabin bay editor also caps the Rear Area entry at 450 kg. No additional ramp-arm loading curve was found in those checks.

`ramp-limits.js` applies the same hinge-moment proxy to combined custom ramp cargo and ramp bay weight, plus the source 49 kg Stokes at 13132 mm when ramp-stowed. Custom cargo with an entered arm inside the ramp interval is included regardless of its displayed cell. Shelf loads and shelf structures are excluded under the confirmed prototype rule. Cabin-deployed Stokes and its patient are not ramp loads. This aggregation extends the source's per-entry warning behavior to avoid splitting a load to evade a warning. The physical ramp arm range is enforced atomically for Ramp records; overweight and moment exceedances remain editable and visible, matching the source warning workflow.

The displayed combined-arm bound is min(14393, 11393 + 450000 / total ramp kg), not a permissible arm for every individual load. Both open and closed weight checks are shown; no aircraft ramp-state simulation has been added. At the configured 12893 mm arm, 300 kg alone reaches 450 kg·m. The status previews a replacement draft without counting the old entry twice and updates after litter moves/removal. This does not alter the pinned aircraft subtotal helpers, source app, approved image registration or cargo entry count.

Boundary and browser checks cover inclusive station endpoints, invalid-edit preservation, 350/450 kg boundaries, 450 kg·m boundary, combined entries, Stokes transitions, shelf exclusion, and desktop/tablet/phone draft warnings. Ramp cargo uses the selected longitudinal fraction between the approved image hinge and aft mark, mapped linearly to X11393–X14393 and rounded to the nearest millimetre. Lateral position affects the displayed marker only. Draft markers can be dragged with mouse or touch; bay weight remains at the source 12893 mm arm. These are image-based estimates, not surveyed placement measurements. Shelf capacity integration and whole-aircraft approval remain separate work.
