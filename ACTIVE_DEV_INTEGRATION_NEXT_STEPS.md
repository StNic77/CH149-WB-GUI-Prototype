> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# W&B Active Dev integration — next phase

Updated 25 October 2026. The UI baseline is accepted for proceeding. Integration has not started; the latest task updated references only.

## Foundation

Use Active Dev's existing model, editor, aircraft definitions, acceptance/accounting, calculations, fuel rules, MCDU and clearance outputs. Keep the prototype's operator interface. Avoid permanently competing catalogues, stores or engines. Preserve existing editor/operational paths while replacements are assessed. Editor changes must ultimately reach the same aircraft state used by graphical edits and outputs.

Start with a bounded inspection and first end-to-end slice, not a broad architecture audit or a rewrite of solved source functions. Technical packaging is open and should follow actual dependencies. Discuss consequential choices and implement in small reviewable increments when requested.

## First slice to propose

1. Establish an authoritative accepted state for one known tail/Role: basic weight/CG, inclusion basis, included role-fit and seat structures, mission quantities/locations, people, loads and fuel. Record the full input state and source version.
2. Trace source editor/acceptance through accounting, computation and outputs. Starting files include config.js, editor.js, accounting.js, accounting-ui.js, compute.js, app.js and mcdu.js. Inspect current contents before relying on them.
3. Connect one graphical edit, for example a Penetration Kit quantity change, to that authoritative state and existing computation/output. Avoid duplicated allocations or independent competing totals.
4. Compare exact weight and moment components, CG, source/destination contents, fuel and warnings before/after. Exercise Cancel, removal/reinstall and a rejected dependency.
5. Extend to split/group moves, containers/fittings, seats/people/patients, cargo/bays and manual fuel only after the first path is concrete and reviewable.

This is a recommended slice, not a request to implement every capability at once. Reuse source tests; add meaningful integration-boundary tests rather than duplicating formulas.

## Recorded inclusion mismatch — resolve early

SAR-3 comparison: basic weight 10401 kg, CG 8487 mm, zero fuel, compared equipment/mission/crew aligned.

| Accepted inclusion basis | Exact weight | Display CG |
|---|---:|---:|
| Prototype CURRENT: captured current fit included | 11423.20 kg | 8386 mm |
| Source maintenance inclusion definitions | 12002.77 kg (12003 displayed) | 8371 mm |

Difference 579.57 kg = role-fit 474.43 + seat structures 105.14. This is an earlier recorded reproduction, not a new measurement of today's Active Dev. CURRENT and maintenance definitions represent different accepted states. Do not change weights, arms or crew to force agreement. Function parity on adapted inputs does not prove session equivalence.

## Editor and lifecycle requirements

Normally fitted and Included in recorded aircraft weight remain independent, with fleet/tail-specific definitions. A normally fitted -511 ECS Pack can still add to basic weight; permanence does not establish inclusion. No Role Config is not an empty role-fit list. Preserve source definitions for flotation/ice protection and PTA differences.

Future lifecycle: select tail; record/accept aircraft information; resume existing tail session; explicit Start fresh with warning. Changing accepted information retains tail/revised information, resets configuration/loading/certification to no Role Config and requires acceptance again after confirmation. Cancel preserves work. The current GUI Role change retains entered fuel; reconcile that expectation deliberately with the source lifecycle.

## Later gates

Complete editor propagation, eligible locations/footprints and people/entered weights. Preserve Operating Weight/CG versus non-fuel/all-up/cargo distinctions needed by MCDU/briefing/clearance. The prototype AUW fuel-allowance display is not automatically equivalent to source Operating-Weight briefing output.

Add persistence/resume/recovery, certification invalidation and operational output equivalence. Carry forward full first-open device download, update checks and an accessible previous-version fallback; browser caching alone is not that feature. Resolve hosting/network/user details when needed.

Keep display coordinates separate from accounting arms and calibration. Reconcile explicit prototype overrides openly, including Bay 6 arm, role defaults and aggregate local/ramp rules. Complete physical-device and operational acceptance before production claims. The published demo is for device testing, not operational certification.
