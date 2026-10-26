# Prototype and Active Dev behavior review — 26 October 2026

The aim is to combine the strongest behavior from both apps. Active Dev is the source of existing accounting and operational capabilities; its interaction behavior is not automatically preferred. Preserve the accepted graphical interface and user-confirmed physical rules. Recommendations below are proposals unless marked agreed or implemented.

## Starting point and scope

- Prototype application HEAD: a2c3e18. Pre-existing uncommitted handoff documents and reference packs were retained.
- Active Dev HEAD: 16a592f, configuration v30, initially clean. No Active Dev files were changed.
- The reduced prototype catalogue identifies itself as v29. Direct comparison found identical role-fit equipment, mission equipment, seats, patient positions and stowage definitions; Transport and CASEVAC preset records differ. The GUI also has explicit user overrides.
- This review covers the first integration path and the loading/workflow differences inspected today. It is not an exhaustive comparison of every editor, reporting, persistence or certification feature.

## Behavior decisions

| Area | Prototype | Active Dev | Recommended combined behavior / status |
|---|---|---|---|
| Starting weight | Previously opened with RFM; alternate CURRENT basis captures fitted equipment and seats. | Recorded/maintenance basis snapshots configured inclusion independently of physical fit. | **Agreed and implemented:** Recorded Basic Weight is the default. Reuse the source inclusion function. Keep RFM as an explicit option. CURRENT remains a separately labelled option, not a synonym for Recorded. |
| Weight versus physical installation | GUI has installed sets and derives accounting declarations. | Distinguishes ADD, REMOVE, ACCOUNTED, EXCLUDED, accepted maintenance removals and custom exceptions. | Keep source accounting distinctions. Today's bounded adapter supports the first baseline path; arbitrary source exceptions and manual declarations are not yet fully represented in the GUI. Do not silently flatten these during later integration. |
| Seats and equipment conflicts | Confirmed C5/P13–P14 and C6/P7–P8 alternatives, cabinet/PTA exclusions, folded-seat basket rules and occupant guards; validates before committing. | Seat toggles and accounting are present, but the inspected source seat editor does not implement the prototype's complete physical conflict model. | **Preserve prototype guards.** Place them at the shared mutation boundary when extending integration; source calculation checks remain complementary. |
| Patient loading | New draft multi-select, including across rack menus, followed by one Add Selected Patients action. Occupied/uninstalled positions cannot be selected; validation is all-or-nothing. | Assign/Clear buttons operate one position at a time in a persistent list. Source patient validation reports occupied unavailable positions. | **Requested and implemented:** prototype batch workflow plus existing source patient weights/arms and validation. Successful batch closes the menu; drafts do not create loads. |
| Removing patient support | Dedicated prototype rack, PTA, Stokes and container actions block removal/moving when occupied. | Source patientIssues reports an unavailable occupied position, but the generic role-fit declaration setter does not itself guard every patient support removal. | **Preserve prototype preventive guards**, and retain source validation for imported or inconsistent state. Do not replace prevention with warnings alone. |
| Role change | Warns, then resets configuration/loading/certification while retaining baseline and all entered fuel settings; Cancel preserves work. | applyRoleFitPreset protects manual declarations; applyPreset replaces seats, occupants, mission allocations and patients, while leaving cargo/zones/fuel in place. | **Keep the already accepted prototype role-change flow for now.** Review whether an additional explicit “change role fit only / retain loading” operation is useful. Do not silently adopt the source's partial reset. |
| Fuel retention | Enter fuel before choosing a Role; retain total, manual mode, tanks and reserve across a confirmed Role change. | Applying a preset preserves fuel, but accepting aircraft data sets total from the log and returns to automatic distribution. | Preserve the prototype's entered-fuel expectation. Decide explicitly what renewed aircraft acceptance should do to manual tanks; full acceptance lifecycle remains later work. |
| Ramp warnings | Aggregates ramp cargo, ramp bay weight and ramp-stowed Stokes; checks closed/open weight and combined hinge moment. Shelf loads are excluded from this ramp check. | Inspected renderCargo warnings check individual ramp cargo entries; rear bay has a separate limit. No equivalent combined assessment was found in that path. | **Prefer prototype aggregate assessment**, using existing configured limits. Keep warnings editable and range/occupant guards mandatory as already agreed. |
| Cargo versus bay weights | Four reusable labelled cargo slots, independent bay entries, duplicate-bay rejection and precise entered cargo arms. | Four fixed cargo-array slots, independent bay map and explicit numeric cargo arms. | Combine the two: preserve prototype interaction and stable slot labels; preserve separate source accounting types. **Integration gap:** current calculation adapter compacts cargo rows, so source MCDU slot identity must be mapped explicitly before integrating that output. |
| Signed cargo and valid arm range | Positive load weights; cabin arms must be finite and nonnegative; ramp arms have the defined ramp range. Signed delta adjusts an existing positive load. | Cargo UI clamps weight to −6000…6000 kg and arm to 4200…14400 mm. | **Decision needed:** recommend positive physical cargo records, with approved negative adjustments represented separately. Confirm the authoritative general cargo-arm range before adding a cabin restriction. Keep both apps' existing behavior until decided. |
| Bay 6 arm | 10875 mm by explicit user decision. | 10884 mm in the source configuration. | **Already agreed:** preserve 10875 mm and its provenance. Source-parity tests must align that deliberate difference when exercising Bay 6. No geometry or arm changes today. |
| Transport/CASEVAC standard fit | Explicit rules omit Sea Tray and place raft/fitting in B3 Stbd F / B4 Stbd A respectively. | v30 presets now include raft/fitting/location overrides at those same locations, but still include Sea Tray. | Raft placement is now substantially aligned despite the older reduced preset records. **Preserve the agreed prototype Sea Tray omission.** Do not refresh presets blindly. |
| Editor, tail state and outputs | Session planning inputs and pinned source functions; page reload loses aircraft edits. | Fleet/tail editor, accepted snapshots, custom exceptions, session persistence, MCDU/clearance and certification paths. | Reuse source capabilities in later bounded slices, with editor changes reaching the same shared state. Today's tail field identifies the test/planning aircraft; it does not implement tail switching, saved-session recovery or tail-specific editor propagation. |

## First integration evidence

The independent browser comparison loads the actual Active Dev application alongside the prototype, rather than testing one adapter against another copy of itself.

For tail 149920 / SAR-3, Basic Weight 10401 kg, Basic CG 8487 mm and zero fuel:

- Previous CURRENT interpretation: 11423.20 kg, displayed CG 8386 mm.
- Matching source Recorded Basic Weight inclusion: 12002.77 kg, displayed CG 8371 mm.
- Difference: 579.57 kg = 474.43 kg role-fit adjustment + 105.14 kg seat-structure adjustment.

The difference is explained by different starting inclusion assumptions. No catalogue weights, arms or crew weights were changed to force agreement.

The comparison checks exact role-fit and seat adjustment weights/moments, Operating Weight/moment, non-fuel weight/moment, AUW, displayed CG, fuel tanks and envelope flags. It exercises a real graphical Penetration Kit quantity edit from 2 to 3 (+14.35 kg), Cancel, rejected destination, removal and reinstall. Additional checks cover preserving physical edits when recorded data is applied, and automatic/manual fuel. Results are written to verification/active-dev-integration-results.json.

## Decisions to discuss before wider integration

1. Retain the accepted full Role reset as the ordinary flow; consider a separately named fit-only operation if needed.
2. Keep negative corrections out of ordinary physical cargo unless an operational use case establishes otherwise.
3. Confirm cabin cargo arm bounds; the source UI's bounds and the prototype's calibrated image are different kinds of evidence.
4. Carry manual fuel through renewed aircraft acceptance, or explicitly reset it after explaining that consequence.

The first integration slice still uses pinned source functions and a reduced catalogue. Live editor propagation, maintenance exceptions, full tail acceptance/resume, MCDU/PDF output integration and persistence remain incomplete. Publication is separate from local implementation and verification.

## Verification completed

Edge passed the independent source comparison, CASEVAC batch checks, existing planning checks, all-role demo/rack guards, loading workspace, ordered weight ribbon, Role reset/controls, combined ramp checks, cargo-slot reuse, detail-return/fuel retention and touch-pan/reset checks. The new CASEVAC flow passed desktop, portrait/landscape tablet and phone sizes.

Safari-engine checks passed CASEVAC batching, the ordered weight ribbon and loading workspace. Fuel-model checks passed all 4153 whole-kg quantities, manual mode, burn endpoints, allowances and source-solver parity. Desktop/tablet/phone CASEVAC screenshots were visually reviewed. Browser checks are emulation; this increment has not been tested on a physical iPad or published.
