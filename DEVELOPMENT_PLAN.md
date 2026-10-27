# CH-149-615 development plan

Updated 26 October 2026. Previous published checkpoint: 0458550. The user subsequently authorized a local implementation review of aft navigation, fresh-session entry/resume, iPad keyboard visibility and the agreed fuel/CG wording. The user has now authorized this reviewed revision to be committed and pushed. IMPROVEMENT_BACKLOG.md is the current detailed list; older dated packs record previous starting points.

## Completed foundation

The accepted image-first UI remains intact. This session added CASEVAC patient multi-select, Recorded Basic Weight as the default, live AUW/CG status and CG bands, cabin-centreline visualization, enlarged live CG strips and the expandable full envelope. An independent Active Dev comparison proves the first matching-state graphical equipment path and reserve-based landing result. The 579.57 kg inclusion distinction is explained. P2/P3 remain correctly additive under the RFM basis, as confirmed by the user.

The source application is unchanged. Existing source functions and the reduced catalogue remain pinned; the first verified path does not complete live editor propagation, aircraft acceptance or operational output integration.

## Current local review

1. Address the user-reported iPad keyboard/menu occlusion as a bounded usability fix. Reproduce actual keyboard behavior before choosing the correction.
2. Discuss a fresh-session lead page for tail, initial Basic Weight/CG and Role, with a short introduction to the graphical workflow. Keep the existing image controls. A valid saved session should resume directly into the image workspace.
3. Coordinate that entry/resume flow with real tail/session persistence, shared accepted state, explicit Start fresh and recovery; avoid a second store or duplicate baseline.
4. Continue Active Dev capability integration in bounded slices, choosing the best-fit behavior from each app and preserving the prototype's accepted physical/occupant guards.

The first three items above now have local implementations for review: tail buttons (149920 displayed as 149SIM), Recorded Basic Weight by default, Basic Weight/CG/initial fuel together, Role, and Accept aircraft opening the image workspace. No reserve or distribution control appears on entry; both remain editable from the image's Fuel planning menu. The user's exact initial-fuel distribution note is included. Versioned local snapshots restore the shared aircraft state to the image page; Return to Start page keeps the existing session until the replacement is accepted. Keep current session resumes it; Accept aircraft accepts new entries and starts over. Incompatible saved data returns to entry.

Aft image targets now open their respective views through the same view-selection function as View controls. They are small highlighted regions at the user-circled cabin edges with hover labels, no permanent text, and equipment selection above them. The equipment-menu Starboard aft parent button now navigates rather than merely closing. Desktop entry alignment is fixed. Focused menu/dialog fields are scrolled within the visual viewport; native iPad keyboard verification remains outstanding. All existing image controls remain available.

Zero-valued quantity inputs now appear blank; an empty quantity is interpreted as zero wherever zero is valid. Positive Basic Weight/CG and cargo creation constraints remain. Occupants is a separate visibility and drawing layer for all crew/passenger/patient badges; toggling it does not mutate aircraft state or W&B. Drawing order is live/reference images, Seats, then Occupants. Seat indicators share the seat/occupant centre (including C4/C5/C6 in SAR-3/SAR-10). Default crew and SAR Tech assignments use the same Crew classification as W&B; only Crew, Passenger and Patient symbols are used and all three appear in the Symbol key. The starboard basket menu also has a Starboard Aft View action. C3 alone is repositioned from its confirmed seat centre at 4559 mm using the common station calibration, just forward of Bay 1 on the centreline. C1/C2 retain 3673 mm; their images and all other seat-image positions are unchanged. Catalogue occupant arms are unchanged.

Local artwork review now uses registered original-image crops for pictured crew/passenger seats and SAR cabinet, mat, basket, PTA and ramp litter placements, with seat/occupant labels following the displayed seats. The cabinet has a compact label in reference mode and no label in live mode; the artwork remains selectable. Aft navigation zones have no fill, even on hover, so the rack remains unobscured. Dive Bottle / O2 Rack uses the full reference artwork, controlled by its existing Role Fit key; the depicted detail does not introduce bottle contents, quantities or dependencies. The user clarified that the artwork itself should become the item. Sensor Workstation is a separate installed/removed visual controlled by its existing Role Fit key, including custom installation in Transport. The live backdrop now preserves the role reference image and its floor panels. Separately rendered item areas are masked from that backdrop, revealing the cleared underlay only when an item is absent or moved. PTA artwork includes its complete grey aft end. Transport/CASEVAC liferafts use their native image positions and proportions. Hidden floor beneath removed items and unpictured/custom fits still need visual review. W&B arms and source masses are unchanged.

The deployed Stokes litter now uses a clean transparent open-frame drawing instead of the enlarged low-resolution crop/filter, retaining its deployment bounds, controls and W&B. In reference mode, a removed sea tray is identified by a Sea tray removed status button at the image corner; the underlying Role image is retained. Reference-mode labels use Fwd shelves (retained fixed fixture), SWS, O₂ rack and Basket, with the latter three following installed state and opening their corresponding item controls. The previous basket symbol is suppressed in that mode. Labels are hidden in live mode and during CG display.

The layer name remains Live equipment. Renaming is explicitly held for later discussion. The rack may eventually become a stowage location with dependencies, but it currently has no contents. User clarified it is not installed in default Transport or CASEVAC: prototype default-fit rules now remove it from both state and W&B for those roles. SAR defaults retain it. Existing saved sessions receive this correction once; subsequent deliberate installations are preserved.

A future clickable-zone highlight layer is discussion-only: hidden by default, remember the user’s choice, keep zones clickable, and keep hover/focus labels and equipment selection independent. Do not implement this layer until the discussion is settled.

Next: user review in the local files, physical iPad keyboard checks, then further source integration only in agreed slices. The user has now requested commit and push of this review revision; deferred design work remains deferred.

## Extend and verify shared capabilities

Connect fleet/tail editor changes and accepted accounting, including maintenance/custom exceptions, to the same state used by graphical actions. Expand comparisons across all roles, split quantities/group moves, containers/fittings, seats/people/patients, cargo/bays and automatic/manual fuel. Add individual entered weights and complete eligible-location/footprint review. Preserve four reusable cargo slots and their source output identities.

## Operational workflow and outputs

Complete tail acceptance/resume/reset and accepted-information changes requiring renewed review. Deliberately reconcile manual fuel retention with renewed acceptance. Integrate MCDU, briefing, clearance/PDF, Operating Weight versus AUW distinctions, certification invalidation and persistence/recovery. Retain existing operational paths until replacements are assessed.

## Delivery and acceptance

Complete full first-open device download, update checking and previous-version fallback. Verify physical iPhone/iPad behavior and operational output equivalence with release/rollback evidence.

## Design direction and parked work

Live CG visualization should make the effects of loads and fuel immediately understandable to the Flight Engineer. Preserve actual positions, weight-dependent limits, readable margins and clear takeoff/landing assumptions.

Role/config-aware detail-image edits, final stretcher location, unverified sponsons and a tentative placement editor remain parked. Do not invent geometry, arms, capacities or tank shapes. Review the outstanding Role-reset, signed-cargo, arm-bound and renewed-acceptance fuel decisions before changing their behavior.
