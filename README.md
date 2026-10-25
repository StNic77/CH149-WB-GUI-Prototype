# CH149 W&B GUI Prototype

An interactive cabin workspace for demonstrating aircraft configuration, equipment placement and people/patient handling.

The accepted image-first interface is on `main`. See [LOADING_WORKSPACE_CHANGES.md](LOADING_WORKSPACE_CHANGES.md) for current view access, shelf/bay warnings, planning calculations and the requirement-to-test cross-reference. Older branch/status notes in IMAGE_FIRST_WORKSPACE are historical.

## iPhone / iPad review

Open [the hosted prototype](https://stnic77.github.io/CH149-WB-GUI-Prototype/) on the device. The 25 October device-test release includes compact space menus, immediate multi-select, Role/Layers/View controls, a hideable handed sizing rail, collapsible summary, revised ramp menu and fuel strip, direct 2D return from details, and fuel retention across Role changes. This is a prototype for usability review. Session edits reset on reload.

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
- Selectable floor cells and a single ramp area, explicit cargo point selection and estimated cabin and ramp cargo arms, with optional known-arm overrides. Ramp bay weight retains its fixed source arm.
- Bays Review station annotations alternate above/below the plan, from X4875 through the ramp endpoint X14393.
- **Mark ramp aft edge · X14393** adjusts only the ramp's image boundary across all configurations. It does not move cabin joints or change station values or loading arms. Finish marking saves through the local preview; hosted/file adjustments can be exported and imported into the local preview for publication.
- The approved ramp edge is embedded in `station-calibration.js` at common image X2351.266647702848 (display pixels). It loads without browser storage or a calibration fetch; the aircraft station remains X14393. The approved cabin joints are unchanged.
- Independent Cargo layer and all-load inspector: four cargo slots, one weight per cabin bay plus the ramp, individual edits/moves/removal, and cargo/bay-only weight, moment and CG subtotals using the pinned reference helpers.
- Live equipment layers for seats, basket, PTA cot, Stokes, Sea Tray, internal raft and CASEVAC racks.
- Seat alternatives, folded-seat occupancy rules, crew/passenger markers and cot/litter patients.
- CASEVAC rack controls: three forward patient tiers, two aft tiers and occupied-rack removal protection.
- SAR cabinet, forward/ramp shelves and overhead compartment close-ups with reviewed selection regions.

Transport and CASEVAC start without Sea Tray. Their internal rafts start with their required fittings at B3 Stbd Fwd and B4 Stbd Aft respectively. These user-approved prototype defaults are kept separately from the pinned source catalogue in `prototype-rules.js`.

## Scope

This is a demonstration prototype, not operational weight-and-balance software. Session-only planning basic weight/CG and fuel entry now drive source-engine AUW/CG feedback; source shelf and explicit bay-load warnings are connected. NVGs follow the four-in-E, one-in-F allocation. Operational acceptance/validation, full equipment coverage, fuel visualization/reporting and save/restore remain unfinished. Equipment and patient edits reset on refresh. Full CASEVAC rack footprint conflicts are not yet validated. Original role renders remain reference imagery; dynamic crops are approximate visual layers.

Cargo symbols and their visibility do not change installation or calculated contribution. Custom loads survive navigation and role switching within the session, but reset on refresh. The displayed load CG includes only individual cargo and bay/ramp entries, not the aircraft or its other loads. See [CARGO_DEVELOPMENT_REPORT.md](CARGO_DEVELOPMENT_REPORT.md).

The bundled catalogue, original reference images and saved shared calibration are included. The separate reference application is not required to run this prototype and is not modified by it. Data refresh tooling is for the original development workspace only.

## Browser checks

```sh
npm install
npx playwright install chromium
npm test
```

The portable demo checks cover role defaults, raft/fitting positions, floor and bay visibility, CASEVAC tiers and patient dependencies at desktop, tablet and phone viewport sizes. Browser emulation is not a physical-device or operational validation claim.
