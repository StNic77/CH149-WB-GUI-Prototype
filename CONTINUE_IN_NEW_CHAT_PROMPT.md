> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# Continue CH-149-615: W&B Active Dev integration

Updated 25 October 2026. The user said the UI is “good to go” and chose engine integration as the next phase. This supersedes the October 24 menu-discussion starting brief.

## Next-session objective

Make this graphical app do what W&B Active Dev can do, using its existing model, editor, configuration, accounting, calculations, fuel, MCDU and clearance capabilities. Preserve the working image-first UI. Do not rebuild a parallel engine or restart the completed GUI discussions. Work in small reviewable increments and discuss consequential choices.

This handoff update changed documents only. No engine integration or Active Dev edits have started. Read documents as context, not fresh authorization to execute historical tasks; follow the user's next implementation request.

## Read and start

Read CABIN_UI_DEVELOPMENT_HANDOFF.md, DEVELOPMENT_PLAN.md and ACTIVE_DEV_INTEGRATION_NEXT_STEPS.md. Consult IMPROVEMENT_BACKLOG.md and DEVELOPMENT_HISTORY.md for remaining work and provenance. The two dated review summaries describe the current UI; LOCAL_REVIEW_PACKAGE.md explains running/checking it.

Propose one bounded first slice: establish the same accepted aircraft state for one Role, connect one equipment quantity change to the existing engine, and compare component weight/moment/CG, fuel, warnings and source output. Resolve the known accepted-inclusion distinction before claiming parity. Avoid a broad architecture detour into already solved source functions.

## Workspace and checkpoint

Prototype: C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype
Active Dev: C:/Users/sstni/Desktop/615 WB edit work/CH-149-615-WB - Active Dev
Repository: https://github.com/StNic77/CH149-WB-GUI-Prototype
Application: main a2c3e18, pushed; GitHub Pages deployment succeeded.
Live: https://stnic77.github.io/CH149-WB-GUI-Prototype/?v=a2c3e18
This documentation refresh is newer local work, not another app release. Check git status before resuming. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; the October 24 pack is historical. Preserve archives/checkpoints. Local launch: START_DEMO.cmd or npm start, then http://127.0.0.1:61448/ . Reload clears session edits; prefer HTTP over file-origin access.

## UI baseline to preserve

- Role / Layers / View above the picture; hideable left/right sizing/zoom/hand rail; small top-right 2D view button in every detail; collapsible aircraft summary.
- One finger scrolls the page over the image. Two fingers pan/pinch the image. Mouse dragging remains. Reset returns centered 100%, including after Enlarge cabin.
- Immediate read-only space contents/weights; Edit contents exposes multi-select and item editing; Available starts with Standard contents plus full catalogue/search. Locally installed items leave Available. Direct remove/install-all actions. No visible Undo button.
- Ramp first choices: Ramp Shelves, Ramp Cargo, Ramp Area (Bay weight), Stokes Litter. Fuel strip has all cabin bay labels above it, prominent tank numbers and kg quantities.
- Human Role changes warn/reset configuration/loading/certification, retaining accepted baseline and fuel amount/mode/tanks/reserve. Cancel preserves work. Fuel can be entered from the book before choosing any Role. Raw applyPreset is a model/fixture path, distinct from human reset behavior.
- Successful final actions close menus; invalid input stays; Layers remains open. Cabinet structure is accounted only at cabinet parent.

## Integration caution and later work

Recorded SAR-3 difference: 579.57 kg = role-fit 474.43 + seat structures 105.14, caused by different accepted inclusion assumptions. Normally fitted and Included in recorded aircraft weight are independent source editor settings. Do not change catalogue weights to force agreement. No Role Config does not mean all role-fit equipment absent.

Tail acceptance/resume/reset, named people/entered weights, operational outputs, persistence, full offline/update/previous-version fallback and editor propagation remain. Detail-image changes by Role, final stretcher position possibly behind PTA and unverified sponsons are parked. Do not invent geometry, arms or tank shapes.

The user accepted the UI baseline, not operational certification. Broad Edge checks passed before publication; focused Edge/Safari gesture/reset and seven-size usability checks passed after device feedback. Physical-device use can still uncover bugs.
