> Release update — 27 October 2026: the user authorized commit and push of the wider landscape Fuel menu (Fuel only), the full CG chart retaining both conditions independently of image selection, and these updated handoff documents. Physical iPad usability remains unconfirmed. The dated reference ZIP is an unchanged snapshot of earlier checkpoint 39b9b7f.

# Run and review — current prototype

Local changes after the package checkpoint: full CG chart always retains both conditions independently of image selection; Fuel has a wider landscape trial with three main entries in a row, Apply/Close together and five manual tank columns. Portrait stays stacked. Both changes are included in the newly authorized device-check release. The dated ZIP remains an unchanged snapshot of the earlier handoff.

For Chrome/Edge desktop layout review, open DevTools (F12), toggle device emulation (Ctrl+Shift+M), select Responsive and enter exact width/height rather than dragging. Trial sizes: 1133x744 and 1024x768 landscape, 744x1133 portrait. Save custom devices through the device list's Edit/Add custom device controls if desired. Reducing landscape height to about 330 px approximates restricted space, but does not reproduce native Safari keyboard scrolling or visual-viewport offsets. Browser simulation is not physical iPad acceptance.

Updated 27 October 2026. Current pushed application: 39b9b7f. Hosted deployment completion is unverified. Device URL: https://stnic77.github.io/CH149-WB-GUI-Prototype/?v=39b9b7f

Local workspace: C:/Users/sstni/Desktop/615 WB edit work/CH-149-615 Cabin UI Prototype. Use START_DEMO.cmd or npm start, then http://127.0.0.1:61448/ . Reuse an existing server; do not stop unrelated processes. HTTP is preferred to file-origin access.

Fresh session: select tail (149SIM is 149920), Recorded Basic Weight/CG, initial total fuel and Role, then Accept aircraft. Initial fuel automatically distributes; verify aircraft distribution in Fuel planning. No reserve is requested on entry. Image controls retain editing of all supported information. Compatible saved sessions resume to the image workspace. Return to Start page keeps the current aircraft until a valid replacement is accepted; Keep current session resumes it. Reload does not intentionally discard compatible saved sessions.

Role/Layers/View stay above image. One finger scrolls page; two fingers move/zoom image; Reset centers at 100%. Detail views have 2D return. Successful final actions close menus; invalid input remains. Human Role changes confirm reset of configuration/loading while retaining aircraft and fuel.

Review the latest CG, seat, SWS, symbol, layer and input fixes using DEVICE_CHECK_2026-10-27.md. Physical iPad/Safari acceptance is still pending. The Live equipment layer name and independent Occupants/Seats controls remain. Detail imagery still has known role/state mismatches; do not interpret the static pictured equipment as the loaded state.

After code/style changes: node version-assets.cjs, then node version-assets.cjs --check. Relevant checks: npm test -- oct27-improvements-check cg-layer-check session-navigation-check occupant-layer-check. See VERIFICATION_STATUS_2026-10-27.md for environment settings and actual completed coverage. This prototype is for development/device review, not operational clearance acceptance.
