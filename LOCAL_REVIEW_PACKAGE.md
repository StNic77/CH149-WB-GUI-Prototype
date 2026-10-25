> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

> **Latest local review, 25 October 2026:** Controls, immediate contents multi-select, fuel strip, framing and collapsible summary are updated. See [CONTROLS_REVIEW_2026-10-25.md](CONTROLS_REVIEW_2026-10-25.md). Earlier menu descriptions below may describe the preceding iteration. No publication or Active Dev changes.

> **25 October 2026 update:** The user subsequently authorized the compact contents-menu increment after interactive mock-up review. It is now implemented locally for review. See [COMPACT_CONTENTS_REVIEW_2026-10-25.md](COMPACT_CONTENTS_REVIEW_2026-10-25.md) for the current flow, checkpoint and checks. Older no-further-code statements below describe the prior handoff; unrelated review findings remain open. No commit, push, publication or Active Dev changes.

> **25 October 2026 — first shelf-flow increment, awaiting user review.** The app now opens shelves with compact Installed / Available choices. Available hides items already at that location; confirmation directs quantity editing to Installed. The standard filter is named Standard shelf contents. Clear all selections is disabled when empty and confirms clearing. Installed quantities are direct target quantities (including zero removal), with preview, Apply/Cancel and menu-local Undo. Other-location allocations remain visible and independently counted. Refresh to load; refresh still clears session edits. No push/publication or Active Dev changes. The 24 October review guide below describes the earlier package where it differs.

# Local GUI usability review — 24 October 2026

This package is local only. Nothing has been pushed or published. Active Dev, the pinned catalogue, source calculation bodies, imagery and approved calibration are unchanged.

## Status after the user's first review

This is an implemented trial, NOT an accepted final GUI. The user reported eleven issues: distant Role controls; global Undo placement; Enlarge cabin skew/cropping C1/C2; wrong-side/overcrowded symbols; a possible bottom fuel strip; insufficiently compact menus; detail-symbol placement corrections and a tentative drag-placement mode; unwanted symbols outside the cabin and boxed stowage labels; fuel hidden by equipment symbols; scattered checkbox layer controls instead of grouped buttons; and confusing install/remove/quantity transitions with repeat-add risk.

All eleven are open. No application fixes were made after that review. The next chat should game out the interactions before more coding; see `CONTINUE_IN_NEW_CHAT_PROMPT.md`, `IMPROVEMENT_BACKLOG.md` section 14 and the revised `DEVELOPMENT_PLAN.md`. The instructions below describe the current package, including choices the user rejected; they are not a claim of usability acceptance. In particular, the global Undo described below must later move into its relevant menu once the interaction is agreed.

The user's framing image is saved at `references/2026-10-24-framing-reference.png`. Preserve image proportions, both pilot-seat controls and the full ramp when discussing the replacement fit. No new calibration was approved.

## Open the prototype

Double-click `START_DEMO.cmd` in this folder and open **http://127.0.0.1:61448/**. If the local server is already running, refresh its browser page. The page also supports opening `index.html` directly. Refresh once to load the new asset versions.

Aircraft edits remain session-only: refreshing clears them. Choosing a Role Config deliberately reapplies its standard equipment; it is not a navigation/back action.

## Review sizes

In Edge/Chrome, press F12, then Ctrl+Shift+M. Choose Responsive and enter CSS viewport dimensions, initially at 100% browser zoom:

| Review | Portrait | Landscape |
|---|---|---|
| iPhone 13/14-sized screen | 390 × 844 | 844 × 390 |
| iPad Mini 6/7 | 744 × 1133 | 1133 × 744 |

Browser emulation checks layout; the actual iPad/iPhone is still needed for final pinch, thumb-reach and browser-text-zoom review.

## What to try

1. **Aircraft view:** choose Whole aircraft or Enlarge cabin. Use the screen-anchored +/− controls, Reset view and left/right-hand setting. Pinch inside the viewer enlarges the aircraft; drag pans the enlarged image. Browser pinch outside the viewer remains available for text. Mouse wheel pans an enlarged image; Ctrl+wheel over the viewer zooms it.
2. **Compact menus:** tap B3 Centre and follow Stokes, Sea Tray or loading choices. Back/breadcrumbs preserve edits. Direct equipment taps open its dedicated controls. Image layers are available under one expandable control.
3. **Quantities:** open cabinet or shelf contents. Select an item, adjust its quantity with − / number / +, then remove or move selected units. Add more uses catalogue default quantity first; choose where the extra units go. Split allocations remain separate and are counted once.
4. **CASEVAC example:** choose CASEVAC, find Penetration Kit in Mission Equipment, add four units and choose a bay. A missing SAR Cabinet does not prevent carrying kits elsewhere. Defaults are not assumed maximum inventory; explicit configured maximums still apply.
5. **Groups:** Select all shelf items or any combination, adjust the selected quantities, then Remove or Move. One destination applies to each group. Use separate groups for different destinations. Available-to-install lists support the corresponding selection/install flow.
6. **Undo equipment:** the bottom results bar offers Undo equipment for the last equipment change. It restores affected quantities, locations and dependent items together. Later incompatible equipment edits invalidate the older undo.
7. **Dependencies and containers:** missing fittings or occupied/conflicting areas are unavailable destinations. Basket, Stokes and raft controls highlight their alternate destination while open. Default container removal removes its contents too; open Contents/Relocate contents first to retain selected loads elsewhere. Removed catalogue items remain available for reinstall.
8. **Shelf feedback:** current total, limit and remaining/excess are near the top. Quantity selections show the resulting load preview; applied changes update shelf, bay and aircraft totals. Additional shelf weight has its own preview. Unknown limits remain explicit.
9. **Bay-weight change:** open a bay load, enter a change, choose + Add or − Subtract, then apply the change to the weight and save. Direct negative entry also works. Removing the complete record remains an explicit Remove action.
10. **Equipment symbols:** off initially in 2D, on initially in detail views. Personal kit, medical pouch (no N), weapon, stretcher, Guidelines/Weights and O₂ symbols are trial designs. Cabinet shelves need no extra symbols. Stowage symbols open current contents, including grouped locations. The equipment list remains available with symbols hidden.
11. **Fuel:** open Fuel for automatic/manual mode and preferred landing reserve. Expand Tank quantities to inspect automatic quantities; manual mode opens those fields for editing. Apply fuel stays available at the top while scrolling. At zero fuel aboard, planned landing fuel is zero; the preferred reserve is retained with a shortfall warning. Optional fuel quantity labels default off. Their appearance is provisional.

## Deliberately parked

Sponsons remain unverified, empty and hidden; no destinations, arms, capacities or contents have been invented. Detail-image optimization/offline/update/reversion work and full Active Dev editor/session integration remain later work. The previously identified planning-baseline distinction is not changed by this usability package.

## Verification

Run `npm test` for the complete regression suite. Individual checks can be selected, for example `npm test -- usability-package-check`. The Windows Playwright setup is unchanged from the development handoff.

The complete regression suite passed in Edge/Chromium. The usability package also passed in Playwright WebKit (Safari engine) at all seven review sizes, including 744 × 1133 and 1133 × 744. These are browser-engine simulations, not physical iOS validation.

The package checks cover partial removal, extra quantities, split moves with mass/CG consistency, atomic rejected groups, Undo, container contents, fitting requirements and installation recovery, destination highlights, signed load changes, reserve consistency, compact menus and layer defaults. Chromium additionally checks a two-finger aircraft pinch without page scrolling/scaling. Physical device review remains the next usability check.
