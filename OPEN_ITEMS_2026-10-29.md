# Current open items — 29 October 2026

## Implemented; device feedback in progress

- Earlier compact Cargo/Bay/Ramp/Additional Shelf Weight editors, Sea Tray cell-first selection, C3 and detail-image fixes preserved.
- Compact mobile presentation, populated Start inputs/unchanged-entry retention, confirmed session clear, deterministic image display defaults.
- In-view Cabin CG bands, Longitudinal CG envelope replacement, CG-only visibility and direct return controls.
- Removed O₂-rack access, SWS label behavior, Ramp shelves label/naming, modest Stokes vector detail, station labels with leaders, B5.5 and full bay demarcations.
- iPad landscape photo is accepted layout reference. iPhone uses compact OpW/CG–Fuel–AUW/CG ribbon, responsive More/Less details, pinch zoom and no sizing panel. Image size is stable across browser-height changes; user reported refresh is good.
- Automatic page-input keyboard alignment was withdrawn after unpredictable real-iPhone jitter. Pre-change keyboard handling is restored; exact above-keypad placement is deferred. Emulation now checks absence of repeated app-driven page scrolling, not successful alignment.

## Current device-test checkpoint

Cabinet/detail-zone alignment correction, shared Units stowed editor, reinstall/search availability, standard-contents shortage top-ups with confirmation/helper, and standard-shelf-plus-non-standard-elsewhere warnings are implemented. Regression checks cover these changes; physical phone/iPad review remains pending. User has confirmed desktop zone correction, pen-kit moves to PTA cot/Bay 6 and return, and the top-up/elsewhere warning flow. Device/OS/orientation were not specified for those equipment checks.

The new keyboard auto-alignment was rolled back after real-iPhone jitter; the user confirmed the jitter is gone. Keep the stable handler. Exact above-keypad placement remains deferred.

## Next selected work

1. Complete device review of this cabinet/quantity checkpoint.
2. Review Aircraft Planning layout.
3. Finish broader catalogue/search usability review; the installed-item search exclusion is fixed.
4. Expand matched-state comparisons before choosing an Active Dev integration slice.

## Later capability work

Broader matched-state Active Dev comparisons; editor/tail propagation and accounting exceptions; accepted-aircraft/per-tail recovery; eligibility/footprints; output identities/MCDU/briefing/clearance/PDF; certification/invalidation; offline/update/fallback/recovery and wider operational acceptance.

Active Dev hard linking/live editor synchronization is future work, design undecided, likely eventual merge. It is not implemented. Preserve Active Dev's existing working-copy image change.

## Policy / deferred work

Fit-only Role changes, negative adjustments, cargo-arm bounds and renewed-acceptance manual fuel policy remain unresolved. Unchanged Start continuation does retain manual tanks.

Real interior imagery, ramp P2/P3 correction, cabinet symbols, wider visual polish and O₂-rack contents/dependencies remain deferred. No individual actual-weight occupant editor is required; standard weights remain settled.

## New future improvement: strip actions

Sea Strip button requested for future work; Mountain Strip is a possible additional action. Removal contents and behavior are not yet defined. Record only, with no implementation or aircraft-data changes until the user specifies the scope. See IMPROVEMENT_BACKLOG.md.
