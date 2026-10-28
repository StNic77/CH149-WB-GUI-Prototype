> Superseded on 28 October 2026: use VERIFICATION_STATUS_2026-10-28.md. The dated content below is historical evidence, not the current backlog or release state.

# Verification and provenance — 27 October 2026

## Latest authorized revision after 7dd6568

Ramp hinge moment is now the visible wording; the user confirmed the existing limits. Constants/formula/aggregation are unchanged. Current release also contains numeric whole-value selection on first focus/tap/Tab and anchored menu placement while typing. The user likes the wider landscape Fuel layout; only Fuel uses that layout.

Current local checks: ramp-limits-check and cargo-slots-check verify unchanged source limits/calculation and updated warnings; menu-entry-position-check reproduces ramp point/new/existing cargo entry at 1440x1000 desktop, 1366x1024 touch and 1133x744 touch; fuel-landscape-check exercises real typing, select-all replacement, Tab/backspace, normal later caret editing, fuel apply/close, manual totals, rotation and reduced keyboard bounds at five sizes. Recent session-navigation/zero-quantity checks also pass. Physical iPad selection remains pending. Latest Git commit/source snapshot in the v2 package identifies the release; the 39b9b7f record below is historical.

Application commit: 39b9b7f406e6d98b3595ea21851b67b3ba85ee89. Commit and push to origin/main were verified. No independent Pages deployment confirmation or physical iPad/Safari acceptance for this revision.

## Local checks completed for the latest revision

Edge/Chromium automated checks passed:

- oct27-improvements-check: 1440x1000, 744x1133, 1133x744; automatic trace endpoints; no arrow/dash attributes; selected and Both CG bands; manual trace absence; no state mutation from visibility; SWS reinstall in both image modes with restored W&B; alternative-seat choices and list exclusions; P7/P8 row/size across Roles; Bay Cell layer order; rack symbol control/removed-state; nearby ramp touch selection; full input bounds and retained text with 330 px and 220 px simulated visual viewports.
- cg-layer-check: desktop, iPad portrait/landscape, phone portrait/landscape; source limits, markers, overweight/out-CG, fuel shortfall, manual mode, pan/zoom registration, layer restoration.
- session-navigation-check: desktop/iPad/phone; entry/resume, aft view controls and simulated keyboard bounds.
- occupant-layer-check: desktop/iPad/phone; occupant visibility, source crew classification, key, seat depth and basket access.
- image-workspace-check and shelf-flow-check: menus, equipment/seats and shelf flows across responsive sizes.
- fuel-model-check: all 4,153 whole-kg quantities, cap, manual mode, endpoints, allowances and Active Dev solver parity.
- planning-check: quantities, moves/removal, shelf warnings, bay drafts, fuel cap, baseline accounting and source-engine parity.
- touch-pan-reset-check: 834x1194, 1194x834, 390x844; native Chromium one-finger scroll, two-finger movement and centered reset.
- live-fidelity-check passed during this revision before the final trace styling-only adjustment; source artwork, rack defaults/resume and independent SWS controls covered.
- node version-assets.cjs --check and git diff --check passed before commit. The final arrow-free styling adjustment reran oct27-improvements-check successfully at all three sizes and refreshed asset hashes.

The full registered test suite was not rerun after every small change. Latest Safari engine was unavailable; do not reuse older Safari results as a pass for this release. Simulated keyboard geometry cannot reproduce all native Safari scrolling and focus behavior.

## Run locally

Node >=18 and Playwright are required. On the current Windows host, set PLAYWRIGHT_MODULE to C:/Users/sstni/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright and PLAYWRIGHT_CHANNEL to msedge. Run npm test -- oct27-improvements-check or an appropriate named subset via node verification/run-checks.cjs. Browser launch may require host approval in the restricted environment. Existing tests can create ignored verification images; source raster references are not rewritten.

## Package integrity

SHA256SUMS.txt covers every package file except itself. source/CH149-prototype-39b9b7f.zip is a Git archive of the exact committed checkpoint, including tracked assets/tests/docs as they existed in that commit. Top-level documents are the newer next-round handoff and take precedence over stale historical descriptions inside that source snapshot. Package references are copied unchanged; no aircraft session/browser data is included. Active Dev source is not bundled; its local path and comparison report are supplied.
