> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# Compact contents — agreed UI baseline

Updated 25 October 2026 after publication and user acceptance of the UI stage. Application checkpoint: a2c3e18. This is the current interaction reference; earlier trial instructions are superseded.

## Overview

Opening a mapped shelf/compartment/stowage or bay contents view shows read-only contents immediately. The space header includes total contents weight; rows show item, quantity and combined row weight. Preview three rows, fading the last only when more are hidden; Show all contents expands. No redundant item-type count. Cabinet structure is shown only at its parent, with contents and total, never counted as each shelf's contents.

Edit contents enables interaction. Available to install starts at Standard contents, retaining full catalogue/category/search access. Ordinary locally installed items leave Available; other-location allocations remain discoverable. Defaults are starting quantities, not maxima. Extra Penetration Kits can be placed in eligible non-cabinet locations, including CASEVAC examples.

Remove all items and Install standard contents are direct overview actions. Small screens may require scrolling in the same menu, without a nested action gate. Specialized container/structure removal retains guards and explicit scope.

## Editing and selection

Selection boxes are immediate beside compact item rows. Select all, Remove selected, Move selected and Clear all selections are first-level controls. Clear all selections is disabled when empty and describes its action. Selected-unit quantities are separate from target Quantity here. A grouped move has one destination; unselected units and other allocations stay intact.

Individual editors expand from their row: target quantity, preview, Apply/Cancel and Remove all of this item at this location. Zero removes locally. Successful final actions close the menu with short feedback; invalid input stays. No visible Undo; internal snapshots remain for recovery/tests.

Default container removal removes it and local contents. Relocate selected contents first to retain them aboard. Preserve fitting, cot, seat, occupant and patient rules. Applied allocations drive local and aircraft totals; do not double-count structures or retained units. Unknown capacity remains explicit.

Ramp starts with Ramp Shelves, Ramp Cargo, Ramp Area (Bay weight), Stokes Litter. The same focused-action approach leads to its guarded editors.

## Checks and recovery

compact-contents-check, shelf-flow-check, usability-package-check, view-controls-check and source planning/fuel tests passed before publication. No illustrative mockup items/weights were copied into aircraft data. Further device bugs can emerge; the user accepted this baseline for engine integration.

Local pre-increment checkpoints: ../prototype-checkpoint-before-compact-contents-20261025-104446.zip and ../prototype-checkpoint-before-controls-symbols-20261025-122622.zip. Git holds subsequent published work. Restore only intended files after checking newer work; do not reset/clean blindly.
