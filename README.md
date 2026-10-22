# CH149 W&B GUI Prototype

An interactive cabin workspace for demonstrating aircraft configuration, equipment placement and people/patient handling.

## Run the demo

Install Node.js 18 or newer, download this repository, then double-click **START_DEMO.cmd** on Windows. Open **http://127.0.0.1:61448** in a browser. Keep the server window open. If that port is already in use, use the running prototype or choose another port with `node preview-server.cjs 61449`.

Alternatively, from this folder run:

```sh
npm start
```

The preview server uses only built-in Node modules. It does not require npm dependencies to run. No external account is needed for the demo.

The approved joint coordinates are embedded in `station-calibration.js`, giving every role the same baseline without browser storage or a network request. GitHub Pages can also read `station-calibration.json` relative to the app folder, while the local preview uses its save service. Deliberate local calibration saves update both files. Hosted adjustments can be exported and imported in the local preview before republishing; a hosted page cannot write repository files.

See [DEMO_GUIDE.md](DEMO_GUIDE.md) for a walkthrough.

## Included interactions

- Shared cabin/bay alignment across No Role Config, SAR-3, SAR-10, Transport and CASEVAC.
- Selectable floor cells and a single ramp area, explicit cargo point selection and estimated cabin cargo arms; ramp cargo with an entered arm.
- Bays Review station annotations alternate above/below the plan, from X4875 through the ramp endpoint X14393.
- Independent Cargo layer and all-load inspector: four cargo slots, one weight per cabin bay plus the ramp, individual edits/moves/removal, and cargo/bay-only weight, moment and CG subtotals using the pinned reference helpers.
- Live equipment layers for seats, basket, PTA cot, Stokes, Sea Tray, internal raft and CASEVAC racks.
- Seat alternatives, folded-seat occupancy rules, crew/passenger markers and cot/litter patients.
- CASEVAC rack controls: three forward patient tiers, two aft tiers and occupied-rack removal protection.
- SAR cabinet, forward/ramp shelves and overhead compartment close-ups with reviewed selection regions.

Transport and CASEVAC start without Sea Tray. Their internal rafts start with their required fittings at B3 Stbd Fwd and B4 Stbd Aft respectively. These user-approved prototype defaults are kept separately from the pinned source catalogue in `prototype-rules.js`.

## Scope

This is a demonstration prototype, not operational weight-and-balance software. Full aircraft calculations, loading/clearance validation, fuel/reporting and configuration save/restore are unfinished. Equipment and patient edits are session state and reset on refresh. Full CASEVAC rack footprint conflicts are not yet validated. Original role renders remain reference imagery; dynamic crops are approximate visual layers.

Cargo symbols and their visibility do not change installation or calculated contribution. Custom loads survive navigation and role switching within the session, but reset on refresh. The displayed load CG includes only individual cargo and bay/ramp entries, not the aircraft or its other loads. See [CARGO_DEVELOPMENT_REPORT.md](CARGO_DEVELOPMENT_REPORT.md).

The bundled catalogue, original reference images and saved shared calibration are included. The separate reference application is not required to run this prototype and is not modified by it. Data refresh tooling is for the original development workspace only.

## Browser checks

```sh
npm install
npx playwright install chromium
npm test
```

The portable demo checks cover role defaults, raft/fitting positions, floor and bay visibility, CASEVAC tiers and patient dependencies at desktop, tablet and phone viewport sizes. Browser emulation is not a physical-device or operational validation claim.
