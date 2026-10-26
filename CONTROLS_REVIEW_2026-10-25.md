> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# Controls, symbols and gestures — agreed UI baseline

Updated 25 October 2026. Main a2c3e18 is pushed; Pages deployment succeeded. The user said “good to go” and chose W&B Active Dev integration next. This is UI-stage acceptance, not operational approval. Older trial and one-finger image-pan instructions are superseded.

Live: https://stnic77.github.io/CH149-WB-GUI-Prototype/?v=a2c3e18

## Controls and gestures

Role / Layers / View remain above the image. Role choices are initially visible and collapse after selection. The floating left/right rail contains Whole aircraft / Enlarge cabin, zoom, Reset and handedness only. Hide controls collapses only that rail; Show controls recalls it. View and hand selectors are not in Layers.

One finger scrolls the page over default or enlarged images. Two fingers pan/pinch the image about their moving midpoint. A brief hint appears when touch users enlarge it. Mouse drag, wheel pan and Ctrl+wheel zoom remain. Reset selects whole-image framing at 100% with both offsets zero, not the previous Enlarge cabin framing. Enlarge cabin preserves proportions, C1/C2 and full ramp.

Every detail has a small top-right 2D view button outside transformed content, usable with the rail hidden. Summary minimizes to a 44px vertical strip on tablet/desktop without changing aircraft state.

## Roles and menus

Human Role changes warn/reset configuration, equipment/loading edits and certification. Accepted baseline and fuel amount/mode/manual tanks/reserve remain. Fuel may be entered from the book before any Role. Cancel preserves everything. Raw applyPreset is a model/fixture entry point, not the human reset flow. Full tail acceptance/resume is later work.

Successful final actions close menus; invalid drafts remain. Feedback lasts 2.5 seconds. Layers stays open until closed with relevant-only highlighted buttons plus Symbol key. Demo help/review/alignment/hand controls are removed. The user likes current Layers behavior.

Ramp first menu: Ramp Shelves, Ramp Cargo, Ramp Area (Bay weight), Stokes Litter. Cargo submenu lists local loads plus Add and Back to Ramp. Existing guarded cargo/bay/litter editors and limits remain.

## Fuel and symbols

Bottom fuel band follows calibrated bay boundaries through zoom/pan. All cabin bay names sit above, including 5 and 5.5 without tank entries. Tank number is prominent and each amount includes kg; phone text stacks. No geometry/distribution/weight changes.

O2 has a 2D symbol and transparent target on the rendered Port Aft rack. Guidelines group inside Stbd Aft basket with quantity. Rifle/shotgun use distinct cartridge/shell details. Stretcher symbol is B6 Port aft with prior accounting arm/allocation preserved; final stowage possibly behind PTA is unresolved. Cabinet contents need no duplicated symbols. Redundant image text selectors are removed; fixtures/regions remain clickable. Configuration-aware raster edits are parked.

## Device feedback and evidence

iPad feedback reproduced a drag stopping after its first movement: a child lostpointercapture event wrongly ended viewport pan. dba5077 fixed capture ownership and centered reset. The user then found that image capture prevented normal page scrolling and approved the final split gestures in 58746ec. One-finger image pan is no longer the touch design.

All registered Edge checks passed across cumulative pre-publication runs. After the final gesture change, native Chromium page-scroll/two-finger/reset tests passed three sizes and seven-size usability/pinch checks passed. Safari engine exercised touch handlers/reset at three sizes, not native physical iPad page scrolling. Earlier hosted iPad image/stale-asset/view/planning checks passed four Safari-engine sizes. The full historical suite was not rerun after every small gesture patch. User device feedback informed the accepted baseline; further bugs remain possible.

Rollback: 261f9d0 cumulative UI package; dba5077 drag/default-reset; 58746ec final gestures. Local checkpoint ZIPs remain outside the repository. Active Dev, pinned source calculation bodies/catalogue, source pictures and calibration were not edited by UI work.
