> **26 October 2026 handoff:** Current published application is **a2c3e18** on main; commit, push and Pages deployment succeeded. The bottom ribbon now shows Basic Weight/CG, Operating Weight/CG, Fuel, Cabin (Bay weight), Cargo, AUW Weight/CG in that order, rounded to nearest kg/mm. No change-since-baseline display; calculation precision is unchanged. This was a UI display increment before source integration. Next session remains W&B Active Dev engine/capability integration. Use NEXT_CHAT_REFERENCE_PACK_2026-10-26; earlier dated packs are historical.

# Loading workspace — current implementation cross-reference

Updated 25 October 2026. The user accepted the UI baseline, published at main a2c3e18, and chose W&B Active Dev integration next. This replaces obsolete local-only summaries; DEVELOPMENT_HISTORY.md retains the chronology.

| Capability | Current implementation | Check examples |
|---|---|---|
| View access | Role / Layers / View above image; top-right 2D escape in every detail; clickable fixtures | detail-return-fuel-check, image-workspace-check |
| Touch/sizing | One finger page, two fingers image; mouse pan; centered 100% Reset; Whole/Enlarge; hidden handed rail | touch-pan-reset-check, refinement-round-check, usability-package-check |
| Contents | Preview, explicit editing, immediate multi-select, Standard contents/catalogue, direct bulk actions | compact-contents-check, shelf-flow-check |
| Load feedback | Contents/extra weight, limits, remaining/excess and unknown capacity; structure only at cabinet parent | planning-check, loading-workspace-check |
| Loads | Four reusable Cargo slots plus one weight per seven cabin bays and Ramp; configured bay arms | cargo-layer-check, cargo-slots-check |
| Ramp | Four compact choices and local cargo submenu, existing guarded editors and aggregate warnings | ramp-fuel-menu-check, ramp-limits-check |
| Fuel | Source auto/manual rules, reserve/shortfall, bay-aligned band; retained across Role changes | fuel-model-check, detail-return-fuel-check |
| Results | Session basic weight/CG/basis, live AUW/CG/fuel, explicit unresolved arms, collapsible summary | aircraft-summary-check, planning-check |
| Asset loading | Content-derived JS/CSS URLs prevent stale-layout reuse | ipad-loading-check, version-assets.cjs --check |

## Accounting and integration boundary

The GUI adapts edited allocations/manual fuel to pinned source functions; it is not live source editor/session integration. Use ACTIVE_DEV_INTEGRATION_NEXT_STEPS.md rather than permanently refreshing competing snapshots.

Local bay checks include explicit cargo, bay records and mission equipment assigned to that bay, excluding inferred fixed equipment/seats/people. Source maxima: 3000 kg, except Bay 5.5 at 1500 kg. Ramp separately combines ramp cargo, bay weight and ramp-stowed Stokes; shelves/structures/contents are excluded by the agreed prototype rule. Warnings remain editable; physical arms and fitting/occupant/patient rules can block. Unknown capacity stays explicit.

NVGs default four in E / LOCKBOX_TOP and one in F / LOCKBOX_BTM; each allocation counts once. Defaults are not maxima. People retain source standard weights until individual entry integration. Missing arms remain unresolved, not fabricated.

CURRENT basis captures current fit as included; source maintenance inclusion differs. The recorded 579.57 kg mismatch must be resolved on identical accepted states. Keep Operating Weight, non-fuel/all-up and cargo/bay quantities distinct for MCDU/briefing/clearance; current AUW fuel allowances do not automatically reproduce all source briefing output.

## Current status and remaining work

Reload clears session edits. Human Role changes reset configuration/loading/certification after confirmation but retain accepted baseline and book fuel. Navigation preserves aircraft work. No visible Undo; internal snapshots remain.

Active Dev and approved imagery/calibration/regions/arms are unchanged. Full editor/model integration, tail acceptance/resume, entered people weights, footprint/eligibility review, persistence/recovery and operational outputs remain. Offline initial download/update/previous-version fallback is not implemented by ordinary caching. Detail-image performance/configuration edits remain parked.

All registered Edge checks passed across cumulative pre-publication runs; final gestures also passed focused Edge/Safari and seven-size usability checks. See LOCAL_REVIEW_PACKAGE.md for live/local launch, dimensions and validation limits. The current turn updates documentation only.
