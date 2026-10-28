# Verification and provenance — 28 October 2026

Current as of 28 October 2026. Base Git commit: 25a6bb1161fb90b4dc977ab00bc4ccfbe85910c7 (main). The source snapshot includes the current UNCOMMITTED working-tree changes; it is not a pushed release. The user will commit and push. Hosting and physical iPad acceptance have not been verified. Historical documents and reference images are context, not new task authorization.

## Latest source checks completed

- detail-image-policy-check: complete four-role matrix, disabled View/mobile/image shortcut choices and helpers, indirect navigation suppressing unavailable imagery, unchanged aircraft state/W&B, contents and cot controls, retained ramp image and re-enabled SAR-3 shortcuts. Passed Edge/Chromium at 1440x1000, 744x1133, 1133x744 and 390x844. View-menu screenshot visually reviewed.
- detail-return-fuel-check: image/placeholder 2D return, original field geometry, retained entered fuel and Role reset behavior. Passed five desktop/tablet/phone orientations; adapted to expected unavailable image placeholders.
- image-workspace-check: image-local seat/location/basket flows, folding/occupant guards, cabinet/shelf access, layer controls and responsive menu bounds passed after final image policy changes.
- session-navigation-check: entry/resume, SAR-3 aft navigation, simulated keyboard geometry and persistence passed four sizes after final image policy changes.
- sea-tray-selection-check: SAR-3/SAR-10 five cells with Bay boundaries off/on, mouse/touch/keyboard, original-cell return, cargo-placement bypass, label registration through zoom, removal/reinstallation and unchanged W&B; passed four sizes. Stokes retained selection priority. Label screenshot visually reviewed.
- Earlier in the same local increment: live-fidelity-check passed source artwork, reference labels and reinstall/default migration at three sizes; occupant-layer-check passed standard classification/key, C3 calibration, seat depth and basket access after C3 tooling removal. These were not rerun after every later presentation-only change.
- JS syntax checks, node version-assets.cjs --check and git diff --check passed for the changes. The full registered suite was not rerun in one final pass.

## Limits

These are browser checks/emulation on Windows, not physical iPad acceptance. The latest Safari engine/device result is not established. No hosted deployment confirmation for the local changes. Earlier fuel solver/source-app parity reports remain valid historical evidence of their own scope, not proof of complete app/operational equivalence.

## Run current checks

Node >=18 and Playwright. On this host set PLAYWRIGHT_MODULE to C:/Users/sstni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright and PLAYWRIGHT_CHANNEL to msedge. Examples: npm test -- detail-image-policy-check sea-tray-selection-check; npm test -- detail-return-fuel-check image-workspace-check session-navigation-check. Browser launch needs host permission in the restricted environment. Avoid claiming a check passed when browser launch was denied/unavailable.

## Package provenance

Source is a complete selected working-tree snapshot based on 25a6bb1161fb90b4dc977ab00bc4ccfbe85910c7, including new untracked policy/test/current-document files. SOURCE_FILE_MANIFEST.json inventories every source ZIP entry by SHA256. SHA256SUMS.txt covers package files except itself. PACKAGE_MANIFEST.json records the working-tree status, explicit exclusions and acceptance limits. No .git history, dependencies, browser profiles, localStorage, credentials, generated image trials or full Active Dev source are bundled.

## Follow-up — compact load menu first group

Implemented Add/Edit Cargo, Add/Edit Bay Weight including Ramp, and additional shelf-weight forms for landscape touch tablets. Inputs are compact with primary actions beside them. Targeted load-landscape checks passed at 1133x744 and 1366x1024 touch, with 744x1133 portrait and 1440x1000 desktop unchanged. Existing menu-entry-position, fuel-landscape, shelf-flow, cargo-slots, detail-image-policy and sea-tray-selection checks passed. Browser checks are not physical iPad acceptance. Reference-pack provenance above describes the archived snapshot, not this later working copy.
