> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# Run and review the current prototype

Updated 25 October 2026. The user accepted the UI baseline and chose W&B Active Dev integration next. This replaces the obsolete “local only / eleven issues open” guide.

## Published version

Application main a2c3e18 is pushed and Pages deployment succeeded:
https://stnic77.github.io/CH149-WB-GUI-Prototype/?v=a2c3e18

Recent commits: 261f9d0 cumulative UI refinement; dba5077 capture/default-reset repair; 58746ec final page/image gestures. Use the versioned link/refresh to load current hashed assets. Reload clears aircraft session edits. This prototype is not operational clearance software.

## Local launch

From C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype, use START_DEMO.cmd or npm start, then http://127.0.0.1:61448/ . Reuse an existing server; do not stop unrelated processes. Prefer HTTP/hosted access. File-origin calibration fetch CORS errors were observed; further loader work was not pursued after the user said the issue was fine.

## Current interactions

- Role / Layers / View above image; hidden left/right sizing/zoom/hand rail. Detail images have top-right 2D view. Summary minimizes on tablet/desktop.
- One finger scrolls the page. Two fingers pan/pinch the image. Reset returns centered 100%, including after Enlarge cabin. Mouse drag/wheel/Ctrl+wheel remain.
- Immediate read-only contents/weights; Edit contents exposes multi-select and item editing. Available starts with Standard contents plus catalogue/search; local installed items disappear from it.
- Partial/split moves, direct install/remove-all and dependency recovery remain. No visible Undo button. Successful final actions close menus; invalid input stays; Layers remains open.
- Ramp has four compact choices, shelves first. Fuel band has bay labels above it, prominent tank numbers and kg quantities.
- Enter book fuel before choosing a Role; it persists across confirmed Role changes. Configuration/loading/certification reset; Cancel preserves work. Full tail acceptance/resume is not implemented yet.

## Checks and limitations

All registered Edge checks passed across cumulative pre-publication runs. Following iPad feedback, native Chromium page-scroll/two-finger/reset checks passed at 834×1194, 1194×834 and 390×844; Safari handler/reset checks passed those sizes; seven-size usability/pinch checks passed. Earlier live-site Safari-engine stale-asset/image/view/planning checks passed four iPad sizes. The full historical suite was not rerun after each small gesture patch.

Other CSS sizes: phone 844×390, Mini 744×1133 / 1133×744, desktop 1440×1000. Browser simulation is not exhaustive device validation; user device feedback informed the accepted baseline.

Run npm test, or npm test -- touch-pan-reset-check usability-package-check. The handoff includes Windows Playwright environment settings. The current reference update changes documents only, not app behavior or Active Dev.
