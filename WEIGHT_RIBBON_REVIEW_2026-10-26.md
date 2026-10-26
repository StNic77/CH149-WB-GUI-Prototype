> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# Weight/CG ribbon — 26 October 2026

## Live status refinement — local, unpublished

AUW label/value now use bold green through 15600 kg, bold amber above 15600 through 16000 kg, and bold red above 16000 kg. These bands use the existing exact-weight flags, so display rounding cannot hide a threshold crossing. Alternate Gross Weight and OVER WEIGHT appear directly inside the AUW group. OUT CG and its value are bold red in that same group's CG line; weight and CG status can appear together.

CG presentation uses the configured envelope at the applicable weight. When overweight, CG is compared with the existing upper envelope edge so excess weight alone does not imply OUT CG. Calculation functions, aircraft weights/arms and envelope definitions are unchanged. Unresolved planning inputs do not receive a green AUW status. Other unresolved-load/envelope messages remain available.

Verification passed in Edge and Safari engines at five desktop/tablet/phone sizes, including exact 15600/16000 kg boundaries, fractional crossings, normal/alternate/overweight combined with out-of-range CG, missing basic data, colours/bold styling, numeric values and responsive bounds. The phone screenshot was visually reviewed.

Before broader Active Dev integration, the user requested the bottom ribbon show, in order: Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG. The user clarified nearest kg/mm rounding and no change-since-baseline display.

The ribbon now presents six ordered groups. Basic/Operating/AUW each have weight and CG; Fuel/Cabin/Cargo have weight. Basic is included in Operating. AUW uses the existing source calculation: Operating + Fuel + bay weights + individual cargo. Cabin includes all existing bay entries, including Ramp; Cargo is individual cargo. Exact input bay/cargo totals are read from the existing adapted session, avoiding premature source display rounding. Operating and AUW values/CG come directly from the existing reference calculation. No source calculation body, catalogue, inclusion rule or arm was changed.

Displayed weights and CGs round to whole kg/mm; exact calculation precision is preserved. Independently rounded visible components can differ from the displayed total by a kg. No change-since-baseline value is displayed. Existing planning/fuel actions and visible warning status remain. Missing basic data/fuel are identified, not shown as invented zeros for unavailable totals.

The six groups remain across tablet/desktop widths; phone widths wrap into two rows in the same reading order. Planning/Fuel buttons move below where needed. Body bottom clearance follows the actual ribbon height to keep content reachable. The larger ribbon still leaves one-finger page scroll and two-finger image pan/pinch intact.

Verification: dedicated five-size checks pass Edge and Safari engine, including Mini 744×1133 and 1133×744, whole-unit rounding, source-derived values, exact component reconciliation, fuel edits, warnings and responsive bounds. Related gesture, loading and iPad stale-asset checks are rerun for this increment. This is a display change before full source integration, not a replacement engine or operational acceptance.

The October 25 reference folder/ZIP remains an archived handoff snapshot; this note and the current app commit are newer. Existing local documentation updates and reference packs are preserved.
