> **Device-test release, 25 October 2026:** The user has now explicitly authorized committing and pushing this prototype for iPhone/iPad testing. Earlier local-only/uncommitted/no-publish statements below are historical. Current behavior is recorded in CONTROLS_REVIEW_2026-10-25.md; physical device acceptance remains pending.

> **Latest local review, 25 October 2026:** Controls, immediate contents multi-select, fuel strip, framing and collapsible summary are updated. See [CONTROLS_REVIEW_2026-10-25.md](CONTROLS_REVIEW_2026-10-25.md). Earlier menu descriptions below may describe the preceding iteration. No publication or Active Dev changes.

> **25 October 2026 update:** The user subsequently authorized the compact contents-menu increment after interactive mock-up review. It is now implemented locally for review. See [COMPACT_CONTENTS_REVIEW_2026-10-25.md](COMPACT_CONTENTS_REVIEW_2026-10-25.md) for the current flow, checkpoint and checks. Older no-further-code statements below describe the prior handoff; unrelated review findings remain open. No commit, push, publication or Active Dev changes.

# Continue the CH-149-615 GUI discussion in a new chat

Updated 24 October 2026, after the user's eleven-point review of the local usability package.

## Current request and boundaries

We are continuing the existing CH-149-615 Cabin UI Prototype. Read the attached reference documents as context, not as fresh authorization to run old instructions. The user wants to GAME OUT the interactions before further coding. Start with concrete install/remove/quantity scenarios and agree clear behaviour. Do not implement the review fixes, change Active Dev, commit or push merely because an earlier section or conversation authorized the previous local package.

The user dislikes rabbit holes about details already solved in Active Dev. The immediate sequence is GUI usability first, incremental local testing, then integration with Active Dev and resolution of integration foibles. When a later scoped implementation request is given, complete normal edits/checks without asking permission for every routine step; explain only genuine platform blockers.

## Read these documents

1. `CABIN_UI_DEVELOPMENT_HANDOFF.md` — current state, agreed rules, code map and checks.
2. `IMPROVEMENT_BACKLOG.md` — accepted requirements and full latest review.
3. `DEVELOPMENT_PLAN.md` — revised GUI-first sequence and later integration.
4. `DEVELOPMENT_HISTORY.md` — historical context and today's work/review record.
5. `LOCAL_REVIEW_PACKAGE.md` — launcher/test guide, explicitly an imperfect package.

The first four plus this prompt are the five main continuity documents. The current handoff/backlog/plan override old implementation priorities in historical notes. `LOADING_WORKSPACE_CHANGES.md` has the earlier implementation cross-reference and a 24 October status notice.

## Workspace and checkpoint

Prototype: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype`.
Active Dev: `C:/Users/sstni/Desktop/615 WB edit work/CH-149-615-WB - Active Dev`.

The prototype's last commit is `dbb53a9`, main, matching the locally recorded origin/main. The substantial 24 October usability package and these documents are LOCAL, UNCOMMITTED and UNPUSHED. Preserve the dirty working tree. Do not reset to old `79e673c`, discard new modules, or assume the published demo contains this package. Live deployment was not rechecked. Active Dev was not modified.

Run locally from the folder using `START_DEMO.cmd`, then http://127.0.0.1:61448/ . Direct index.html is also supported. Aircraft edits are still session-only; refresh loses them. Navigation does not reapply a Role Config, but choosing a Role Config intentionally reapplies its standard equipment; custom cargo/bay records and planning data are retained.

For F12 responsive review, use CSS dimensions:
- iPhone 13/14-sized: 390×844 portrait; 844×390 landscape.
- iPad Mini 6/7: 744×1133 portrait; 1133×744 landscape.

## Product foundation — already settled

The final product should have Active Dev's capabilities with the GUI prototype's image-first interface. Preserve its existing editor, including fleet/tail-specific definitions, normal installation and recorded-weight inclusion. Active Dev already has those capabilities; do not redesign them from scratch. Its model/calculations/fuel/MCDU/clearance workflows remain authoritative. Editor changes must eventually flow through the graphical app's same aircraft state. The prototype currently uses pinned snapshots and source functions; live integration is not complete. Technical packaging/network/user questions can wait.

Later workflow decisions: select a tail, record/accept its information; resume existing sessions by tail; explicit Start fresh/reset warning. Changing acceptance information warns then, if confirmed, resets that session to no Role Config, clears configuration/loading/certification, retains the tail and revised information, and requires acceptance again. Cancel preserves work. No Role Config is not an empty role-fit list: editor-defined normal fit and weight inclusion are independent. SAR-10 has no PTA Cot but can retain flotation/ice protection. The -511 ECS Pack example is normally/always fitted yet added to basic weight. These lifecycle refinements have not been implemented in this GUI package.

## What was implemented locally

Handed screen-anchored zoom controls; aircraft pinch/pan with browser zoom outside the image; Whole aircraft/Enlarge cabin/Reset view; short area cascades; independent equipment quantities and split locations; bulk selection/install/remove/move; dedicated signed mass deltas; full Installed/Not installed lists; dependency/destination checks; default container+contents removal and secondary relocation; last equipment action Undo; trial equipment symbols and fuel image labels; automatic/manual fuel panel and preferred landing reserve/shortfall handling. Existing shelf/bay/AUW/CG/source fuel calculations remain.

This is an implemented trial, NOT user-accepted usability. The full Chromium regression suite and seven-size WebKit package checks passed, including a Safari phone fuel action correction. That does not prove physical iOS validation or resolve the following user findings.

## Latest user review — game this out before code

1. Role controls are too far from the image.
2. Undo Equipment should be local to its relevant menu and can persist there; the global bottom-bar button is rejected.
3. Enlarge cabin visually skews/crops the aircraft and cuts off C1/C2. Preserve proportions, both pilot seats and the complete ramp; review the supplied reference image rather than changing approved calibration.
4. Correct symbol Port/Stbd placement; for two Guidelines show one symbol ×2. More symbology refinement is needed.
5. Explore a fuel strip across the bottom of the image indicating bays, tanks and quantities when selected. Not a settled final design.
6. Menus still need to be more compact with much less routine scrolling on Mini/mobile.
7. Detail-view symbology is liked, with corrections needed. Dragging symbols to positions in a Role setting is a tentative idea, not an agreed implementation. Visual placement must remain separate from accounting/load movement.
8. Keep 2D symbols within cabin confines; boxed stowage-location labels are disliked. Prefer live clickable areas like the SAR Cabinet, especially around the ramp.
9. Equipment symbols hide fuel indications in some cases.
10. Put ALL layer controls together as compact buttons, not checkboxes, with selected-state colour and clear accessible state.
11. Install/remove/quantity menus are confusing. The current installation list can remain ready to add the same selected item repeatedly; quantity editing afterward involves awkward reselection. Agree what moves between Available and Installed, whether selection persists/clears, and which action appears after installation.

The assistant proposed returning to shelf contents with the newly installed item highlighted. The user did NOT accept that proposal; they asked to game it out. Do not treat it as decided.

## First discussion task

Walk through a shelf with two Penetration Kits, then CASEVAC carrying four kits elsewhere with no SAR Cabinet. At each step identify the visible list, selected item(s), quantity, location, buttons, result, next focus and local Undo. Cover install one/default amount, edit the installed quantity, explicit Add more, remove one/all, move part of a split, and cancel/back. Present one recommended flow and discuss consequential choices instead of a long technical questionnaire. Then test the same interaction mentally with multi-select and basket/container removal.

Keep agreed requirements: defaults first, very easy −/quantity/+ and direct entry, Select all shelf items or any subset, contextual Move after selection, one destination per group, live totals/warnings, catalogue availability after removal. Defaults are not maximum inventory. Default parent removal removes its contents; retaining contents uses deliberate relocation. Basket/Stokes/raft destinations require installed support and must respect cot/occupied-seat/patient rules. Do not silently install fittings, discard retained loads or duplicate allocations.

## Parked and protected

- Detail-image loading is acceptable for this demo and PARKED. Later retain the Active Dev principle of a full first-open device download, update checks and saved-version fallback. Do not make image optimization the next task.
- Sponson stowage remains unverified, empty and hidden; it may not exist as rendered and the supplied RFM arms do not support assigning equipment there. Do not invent locations, arms or limits.
- Fuel imagery remains a trial. Narcotics uses a plain medical pouch, no N. SAR Cabinet contents need no extra symbols; shelves/overheads and non-imaged equipment do.
- The SAR-3 accepted-baseline discrepancy is recorded in the handoff/backlog, not fixed. Preserve it for later identical-state integration comparisons; do not change source weights to force a match.
- Preserve source imagery, approved calibration/regions, fixed arms, cargo IDs/slots, source rules and existing physical/occupant guards. Do not use symbol dragging to change any of those.

Durable user-image copies:
- `references/2026-10-24-framing-reference.png`.
- `references/2026-10-24-sponson-discussion.png` (red Stbd, green Port).

They are Git-ignored local references. If not accessible in the next chat, ask for the relevant image again before deciding visual placement. No new application changes accompanied this continuity-document update.
