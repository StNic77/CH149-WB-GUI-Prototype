# Fuel foundation — 23 October 2026

The subsequent loading-workspace increment activates automatic fuel planning alongside basic-weight/CG inputs. See `LOADING_WORKSPACE_CHANGES.md`; its current status supersedes the dormant-UI notes below. Burn plotting and manual tank UI remain deferred.

Fuel-only data and helper functions are pinned from Active Dev; its files are unchanged. Equipment snapshots, defaults and calibration are unchanged.

- `fuel-source.js`: source version/hashes, tank arms, all twelve signed stages, tank/bay mapping, 4,152 kg cap and 15,600/16,000 kg planning targets.
- `fuel-reference.js`: unchanged source helper block for automatic distribution, manual tank totals, fuel moment, departure/landing points and mapped burn track. Private session dependencies are supplied by the adapter.
- `fuel-model.js`: on-demand isolated evaluation; no prototype state writes, background work, charts or full aircraft engine. Invalid quantities and landing fuel above departure are rejected. Manual mode suppresses the predicted track while retaining the source mapped landing calculation.
- Fuel summary: capacity, locations and source mode rules. No invented aircraft results or active fuel inputs.

`CabinFuel.evaluate(input, nonFuel)` accepts fuel total/landing or manual tank quantities. Optional complete non-fuel `{weight, moment}` enables reference plot results. Never supply cargo-only subtotals as aircraft data. This interface is preparation, not whole-aircraft integration or operational validation.

`CabinFuel.allowances(nonFuelWeight)` includes all aircraft weight excluding fuel, including cargo and bay loads. This deliberately differs from Active Dev's current display based only on Operating Weight. Results are weight-based allowances, capped at 4,152 kg, floored to whole kilograms; they do not establish CG/envelope suitability. An overweight aircraft is flagged even with zero fuel.

The source automatic solver uses positive deltas in stage order (including positive parts of mixed stages); the burn track samples the same map at 50 kg intervals. It is not a timed engine/APU/transfer simulation. Preserve this behaviour for parity until separately reviewed. No per-tank capacity enforcement beyond the source aggregate cap is claimed.

User discussion: the MCDU may use the Operating Weight allowance convention and subsequently report OUT CG / OVER WEIGHT. Retain that as a reconciliation question, not a verified MCDU specification. Distinguish the source OW-based briefing allowance from the proposed all-load weight allowance and final CG/weight checks before enabling the UI. Neither convention is silently changed in Active Dev.

Run `node verification/fuel-model-check.cjs` for every whole-kg automatic quantity through 4,152 kg, source solver parity, manual-mode behaviour, burn endpoints, caps, allowances and input preservation. `node port-fuel-source.cjs` deliberately reimports fuel only from the local source; review its diff before accepting a refreshed snapshot. Normal demo use never reads Active Dev.

Pending: accepted baseline/accounting adapter, all aircraft weight edits, people/fuel entry, live AUW/CG, allowance presentation, envelope checks and visual fuel design. The discussed view access, sidebar removal and shelf/bay limits are separate pending increments.
