> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# CH-149-615 current backlog

Updated 25 October 2026. The user accepted the current GUI baseline and chose W&B Active Dev integration next. The October 24 “all eleven open” status is superseded; chronology remains in DEVELOPMENT_HISTORY.md.

## Next priorities

1. Reuse source model/editor/accounting/calculations and operational outputs through this GUI. Start with one same-state end-to-end path; see ACTIVE_DEV_INTEGRATION_NEXT_STEPS.md.
2. Reconcile accepted inclusion, including the recorded 579.57 kg SAR-3 difference; do not alter source weights to force agreement.
3. Extend shared state across quantities/allocations, containers/fittings, seats/people/patients, cargo/bays and fuel, with editor propagation.
4. Complete tail acceptance/resume/reset, entered people weights, MCDU/clearance, persistence/recovery and later delivery support.

## Original eleven findings — current disposition

| # | Finding | Current result |
|---|---|---|
| 1 | Role controls far from image | Compact Role / Layers / View above it; Role choices collapse. |
| 2 | Global Undo inappropriate | Visible Undo removed by later user decision; internal snapshots remain for recovery/tests. |
| 3 | Enlarge cabin loses C1/C2 | Uniform fit preserves pilot targets/full ramp; Reset is centered 100%. |
| 4 | Wrong-side/repeated symbols | Side association, grouped Guidelines, O2 and weapon symbols corrected; later image/placement work parked. |
| 5 | Proposed fuel strip | Bottom band implemented with all bay labels above, prominent Tank numbers and kg quantities. |
| 6 | Oversized menus | Compact cascades, immediate contents and focused editing/selection. |
| 7 | Detail symbols/possible drag mode | Agreed symbol corrections implemented. Drag-placement editor remains tentative/unapproved; role-aware picture changes parked. |
| 8 | Boxed labels/outside symbols | Redundant image text selectors removed; fixtures/regions clickable; compact ramp choices. |
| 9 | Fuel hidden by equipment | Separate bottom band above equipment-symbol content. |
| 10 | Scattered/large Layers | Relevant highlighted buttons plus Symbol key; no demo help/review/alignment/hand choices. User likes current behavior. |
| 11 | Confusing install/remove/quantity | Local installed items leave Available; Standard contents/full catalogue; direct quantity/removal and immediate multi-select. |

## Additional implemented decisions

Hide/Show controls affects only the sizing/zoom/hand rail. Each detail has top-right 2D view. Summary minimizes to a vertical strip. Successful final actions close menus; invalid input stays; Layers remains open. Feedback is short.

Remove all items / Install standard contents are direct overview actions. Edit contents exposes Select all / Remove selected / Move selected / Clear all selections and row checkboxes immediately. Cabinet structure belongs at cabinet level; spaces show contents weights. Defaults are starting quantities, not inventory ceilings.

Human Role changes warn/reset configuration/loading/certification, retaining accepted baseline and fuel amount/mode/tanks/reserve. Cancel preserves work. Fuel can be entered before a Role.

Ramp starts with Ramp Shelves, Ramp Cargo, Ramp Area (Bay weight), Stokes Litter. One finger now scrolls the page over the image; two fingers pan/pinch the image; Reset is centered 100%. Mouse dragging remains and a brief touch hint explains two fingers.

## Parked / future

- Remove/reposition equipment in detail reference images when Role/configuration changes. Photographs do not establish actual installed state.
- Confirm final stretcher position, possibly behind PTA. Current symbol is B6 Port aft; prior accounting arm is unchanged.
- Confirm sponsons exist and eligible contents/arms; keep empty and hidden until verified.
- Complete eligibility/footprints and missing operational capabilities through source integration.
- Full offline download/update/previous-version fallback; ordinary caching does not implement it.
- Continue device use and fix concrete bugs. UI acceptance is not certification or exhaustive validation.

Preserve group selection scope, one destination per group, container+local-contents removal with deliberate relocation to retain contents, fitting/occupant/patient guards, warning versus mandatory-limit distinctions, unknown capacity and fixed geometry/arms. Detailed rules are in the handoff.
