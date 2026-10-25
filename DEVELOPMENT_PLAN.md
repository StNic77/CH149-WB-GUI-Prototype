> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

> **Latest local review, 25 October 2026:** Controls, immediate contents multi-select, fuel strip, framing and collapsible summary are updated. See [CONTROLS_REVIEW_2026-10-25.md](CONTROLS_REVIEW_2026-10-25.md). Earlier menu descriptions below may describe the preceding iteration. No publication or Active Dev changes.

> **25 October 2026 update:** The user subsequently authorized the compact contents-menu increment after interactive mock-up review. It is now implemented locally for review. See [COMPACT_CONTENTS_REVIEW_2026-10-25.md](COMPACT_CONTENTS_REVIEW_2026-10-25.md) for the current flow, checkpoint and checks. Older no-further-code statements below describe the prior handoff; unrelated review findings remain open. No commit, push, publication or Active Dev changes.

# CH-149-615 Graphical W&B Workspace — Development Plan

Updated 24 October 2026 after implementation and first user review of a LOCAL usability package.

## Direction and current status

Deliver Active Dev's existing capabilities through the prototype's image-first interface. Preserve its model, editor, fleet/tail configuration, normal-fit/inclusion rules, accounting, calculations, fuel, MCDU and clearance outputs. Do not rebuild solved engine/editor functions.

The user explicitly changed the sequence: GUI usability first; integrate and resolve foibles once the GUI is useful. Earlier integration-first stages are retained below as later gates, not today's critical path. Avoid rabbit holes in already solved source details.

The 24 October package is implemented locally but NOT usability-accepted. Its broad automatic checks passed; the user's eleven review findings remain open. The latest request is documentation and a new-chat discussion to game out interactions. This plan authorizes no further application edits, Active Dev changes, commit, push or publication.

## Phase A — Agree the operator interactions (NEXT)

Start with a concrete shelf/equipment workflow, not another architecture audit:
1. Inspect the currently installed shelf contents and their quantity/weight.
2. Select an available item, start with its default quantity, change it easily and choose a destination when needed.
3. Complete Install exactly once. Agree the transition to Installed, selection/focus after completion and what button replaces Install. Repeated additions must be deliberate, not a misleading still-active action.
4. Edit an installed quantity, explicitly Add more, remove selected units/all units, or move a chosen quantity while leaving the rest.
5. Apply the same rules to Select all shelf items and arbitrary multi-select, with one destination per group, live feedback, Cancel/Back and menu-local Undo.
6. Walk through cabinet/basket removal and retained-content relocation, including installed stowage, cot, seats and patients.

Use two examples: two Penetration Kits on a SAR shelf, and four kits in CASEVAC without a SAR Cabinet. Then a grouped shelf move and a basket dependency example.

**Exit:** agreed visible lists, selections, quantities, buttons, results, next focus and local Undo for these scenarios. A return-to-shelf/highlighted-item proposal has NOT yet been accepted. Discuss consequential choices before coding.

## Phase B — Agree framing, controls and visual layers

The current trial needs these review corrections:
- Bring Role controls close to the image while retaining device-anchored handed zoom controls.
- Correct Enlarge cabin so proportions and C1/C2-to-full-ramp access are preserved. Use the user's framing image for discussion; preserve registered source imagery and calibration.
- Keep all layer controls together as compact state-coloured buttons, replacing scattered checkboxes.
- Keep 2D symbols within the cabin; correct Port/Stbd association; show repeated Guidelines with one symbol ×quantity. Replace boxed stowage-location labels with direct live fixture/region selection, following the SAR Cabinet precedent. Ramp interactions need particular review.
- Retain the liked detail-view symbols but correct their placement. Discuss a dedicated visual-placement editing mode if useful; the user's drag idea remains tentative. Agree placement scope/persistence before implementation, and never change accounting arms or allocations by moving a symbol.
- Explore a selected fuel strip at the image bottom showing bay/tank/quantity. Ensure fuel remains readable with equipment symbols on. This is an alternative to the current floating labels, not an accepted final design.

**Exit:** reviewed layouts and example symbol/strip arrangements at phone and Mini portrait/landscape, with clear separation between runtime load edits and visual placement editing. No new equipment positions or tank shapes may be invented.

## Phase C — Implement a bounded refinement package, then user-test

Only after the user requests implementation of the agreed scope:
- Build the agreed menu transitions and local Undo, framing/control changes and selected visual experiments.
- Preserve the working quantity/allocation accounting and dependency guards rather than replacing them to simplify the UI.
- Test source/destination totals, aircraft mass/CG changes, split units, atomic invalid groups, reinstall, relocation and Undo.
- Test meaningful visible actions, scrolling and touch reach in addition to numbers and viewport bounds.
- Refresh content-derived asset URLs and run appropriate checks. The current suite supports selected checks through `npm test -- <check-name>`.
- Deliver locally for user testing. Publication is a separate explicit decision; no automatic push.

**Exit:** the user can complete representative tasks with clear results and minimal routine scrolling. Automated passes alone are not usability acceptance. Current baseline tests: full Edge/Chromium suite and seven-size WebKit usability package passed before the latest user review; new regressions should protect the newly agreed transitions.

Review CSS sizes: phone 390×844 / 844×390; iPad Mini 6/7 744×1133 / 1133×744; larger tablet 834×1194 / 1194×834; desktop 1440×1000. Physical device checks remain necessary for final gestures and browser accessibility zoom.

## Phase D — Integrate with Active Dev after usability is ready

- Use the source model/configuration/editor as the foundation and the GUI as its operator interface. Technical packaging remains open; do not maintain a permanent competing catalogue/store/engine.
- Preserve existing editor, operational forms, MCDU and clearance output until replacements are explicitly accepted. Future editor changes must flow to the GUI.
- Map identical source and GUI states for equipment, quantities, allocations, carriers/fittings, seats, people, custom cargo/bays and fuel. Reconcile deliberate prototype overrides explicitly; do not silently refresh them away.
- Reconcile the recorded SAR-3 maintenance/current-fit inclusion example (579.57 kg difference) using identical accepted states, not adjusted weights.
- Keep operating weight/CG distinct from cargo/bays/fuel and all-up results for MCDU use.
- Prove one end-to-end interaction against the shared state and existing operational output, then extend it systematically.

**Exit:** graphical edits, editor definitions, source computation and operational outputs operate the same accepted aircraft state with reproducible component comparisons and recovery.

## Agreed future session workflow — not yet implemented here

- Select a tail and record/accept its information. Existing tail sessions resume. Start fresh warns before resetting.
- A confirmed change to acceptance information resets that tail's configuration/loading/certification to no Role Config, retains revised information and requires acceptance again. Cancel preserves the session.
- No Role Config does not imply no role equipment: source editor normal fit and basic-weight inclusion remain independent. SAR-10 can omit PTA Cot and retain flotation/ice protection. The -511 ECS Pack example is fitted but added to basic weight.
- Those editor capacities already exist in Active Dev; carry them through rather than reopening every equipment-accounting decision now.
- Networking/user/account assumptions remain open. Tail-based operation is a settled requirement; the technical selection/session implementation still needs integration work.

## Phase E — Operational completion and release

- Complete people/weights, equipment/location/footprint coverage, fuel/landing/burn needs, MCDU cross-checks, clearance output, persistence/recovery and source configuration ownership.
- Carry forward the user-requested Active Dev delivery principle: full first-open device download, update checks and an available previously saved version for fallback. Browser caching is not proof of reliable offline/reversion capability.
- Run identical-state comparisons across roles/manual edits; verify editor-added items remain available through deliberate fallback controls.
- Complete user review, operational acceptance, release notes and rollback plan before any production publication.

**Exit:** agreed evidence and an explicit release decision. A visual prototype or function-parity test is not operational acceptance.

## Parked work and cross-cutting constraints

- Detail-image performance is acceptable for this demo and is parked, not the first next task.
- Sponsons: unverified, empty and normally hidden; no new model destinations/arms/limits. Their existence as rendered is uncertain.
- Cabinet structure-weight presentation and conditional ramp-detail Stokes imagery remain parked.
- Default container removal removes contents too; retaining them uses explicit relocation. Old relocation-first wording is superseded.
- Quantities start from defaults but are easy to change. Defaults are not maximum inventory; preserve explicit source maxima separately. A CASEVAC load can include extra kits in defined non-cabinet locations.
- Fitting, cot, seat and patient guards remain. Loading exceedances normally warn unless a particular mandatory limit is agreed. Unknown capacity stays explicit.
- Preserve reviewed imagery/geometry and calibration. View zoom, symbol placement and loading/accounting coordinates are different concepts.
- Fuel is quantity/provenance, not fabricated liquid shape. Preferred reserve is not fuel actually available to land with.
- Keep the current uncommitted local package intact. No Active Dev modification or publication is authorized by these documents.

Detailed review: `IMPROVEMENT_BACKLOG.md`. Current modules, rules, checkpoint and verification: `CABIN_UI_DEVELOPMENT_HANDOFF.md`. New-chat starting task: `CONTINUE_IN_NEW_CHAT_PROMPT.md`.
