# Next logical work — iPad landscape text-entry menus

## Decision / status

The user likes the wider Fuel landscape menu and requested its approach be applied eventually to ALL menus with text/numeric fields on iPad in landscape. This is the recommended next discussion/development slice. It is recorded future work; no extension is implemented by this documentation update.

## Start the new chat

1. Inspect git status/log and determine whether the user committed/pushed the current package. Review any physical-device feedback.
2. Inventory affected menus and confirm the initial group with the user. Recommend cargo/new and existing load forms plus aircraft planning as representative cases; then quantities/contents/additional shelf weight and catalogue/search fields. Do not impose Fuel's five-column tank layout on unrelated forms.
3. Agree a shared layout behavior and acceptance criteria, implement the smallest coherent first group, then review on the actual iPad before broad rollout.

## Current working pattern / files

- Fuel: fuel-ui.js creates fuel-main-fields, fuel-primary-actions and tank rows. usability.css contains .fuel-landscape row/column styling.
- image-workspace.js positions the one floating menu and contains Fuel-specific landscape sizing. keyboard-menus.js handles numeric entry, focus and visual-viewport constraints. Preserve existing anchored entry behavior.
- Cargo/new floor loads: floor-area.js and cargo-layer.js; adjustments: compact-workspace.js.
- Aircraft inputs: planning-ui.js. Fresh-session entry: session-entry.js (review separately if needed; it is a page, not a floating menu).
- Contents/quantity/search and extra shelf loads: equipment-ui.js, shelf-editor.js and relevant local editors. Inventory actual controls rather than relying solely on this file list.
- Existing regression foundations: fuel-landscape-check, menu-entry-position-check, session-navigation-check, zero-quantity-check and image-workspace-check.

## Intended behavior

Use available landscape width with compact rows and reachable actions, retaining scroll where needed. Keep the entire focused input and current text visible above the native keyboard. Preserve drafts, selected aircraft, quantity validation, field switching, numeric whole-value replacement, normal later caret placement, and existing Apply/Cancel semantics. Menus remain anchored while typing and adjust only when viewport constraints require it. Portrait retains its present layout; no calculations or aircraft-data changes.

## Acceptance

Check iPad Mini landscape and larger iPads, keyboard opening/closing, text and numeric keyboards, switching fields/Tab, replacing values and later caret edits, scroll/action access, Cancel/Apply, orientation changes and draft retention. Regress desktop and portrait layouts. Simulated visual-viewport bounds and desktop browser touch are useful but cannot close physical Safari acceptance.

After this usability work, choose the next bounded integration slice with the user: broader matched-state comparisons and shared live editor/accepted accounting. Operational outputs, certification and offline lifecycle remain later work.

## Follow-up implementation

The user selected and authorized the first group: Add/Edit Cargo, Add/Edit Bay Weight including Ramp, and Additional Shelf Weight. These now use compact landscape tablet inputs with adjacent primary actions; new-load Cancel remains on the input row. Physical iPad testing is next. Aircraft planning, quantity editors and search fields remain outside this increment.
