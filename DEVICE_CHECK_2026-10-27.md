# Device review sheet — 39b9b7f

Latest feedback/release: the user likes Fuel's wider landscape layout delivered after this baseline. The next authorized revision adds numeric select-all and prevents desktop/large-tablet focus recentering, while retaining necessary keyboard visibility adjustment. Verify on-device that tapping a populated field replaces the full value and that opening/typing ramp cargo does not jump unnecessarily. Other menus have not received the wider Fuel layout. Ramp limits are user-confirmed correct; Ramp hinge moment is a wording change only. Pending rows below remain a historical baseline checklist; use the refreshed v2 source snapshot/current git log.

User feedback received after this sheet was prepared: iPad entry menus remain clipped and difficult to use. Keyboard/menu acceptance failed; exact device/OS/orientation and affected fields were not supplied. The pending rows below remain detailed checks, not evidence that this issue passed. A replacement editor interaction is now for discussion.

Use https://stnic77.github.io/CH149-WB-GUI-Prototype/?v=39b9b7f after the hosted site updates. Push is verified; hosting completion is not. The URL query identifies the requested checkpoint but does not prove deployment. Refresh before testing. This sheet records checks to perform, not passed results.

Record iPad model, iPadOS/Safari version, orientation, starting Role/tail/fuel, action, expected result, actual result and screenshot if a problem remains. Note whether it happens after zooming or changing orientation. A valid saved session should resume without clearing it merely for testing.

| Check | Expected result | Actual result |
|---|---|---|
| Fuel at landing entry with keyboard, portrait and landscape | Entire active input and its current text visible inside menu; other content scrolls | Pending |
| Cargo weight/arm, quantity and shelf additional weight fields | Same full-field visibility; no sticky row covering input | Pending |
| Planning Basic Weight/CG fields | Entire field visible above keyboard; text retained | Pending |
| Keyboard dismiss, next field, orientation change | Menu remains usable; no stale sizing or lost entry | Pending |
| Ramp forward/aft shelves, zoomed and unzoomed | Taps on/near narrow face select nearest shelf; panning does not select | Pending |
| Ramp View menu | Adjust ramp shelf areas opens existing area review | Pending |
| CG automatic fuel | Clean continuous burn line on full chart, no series of arrows | Pending |
| CG Takeoff, Landing, Both | Selected marker emphasized; Both shows distinguishable ranges for each weight | Pending |
| CG manual tanks | No invented burn trace; unavailable explanation visible | Pending |
| Add/move load and change fuel | CG, bands and full trace update from the same aircraft state | Pending |
| P7 with P8, especially Transport | Pictures share row/size; labels stay at seat positions | Pending |
| C6 versus P7/P8; C5 versus P13/P14 | Excluded markers hidden/list entries disabled; absent alternatives use one choice control | Pending |
| Remove/reinstall SWS from image, live on/off | Empty position remains selectable and fitting can be restored | Pending |
| Port Aft rack/stretcher symbols | Symbols align with reference items and open appropriate controls | Pending |
| SAR-10 Port Aft guideline/detail picture | Capture remaining mismatch for deferred image/symbol review | Pending |
| Bay Cells and Bay Boundaries both on | Cells remain accessible; seat/item controls still function | Pending |
| Save/reload and Return to Start / Keep | Compatible session retained; replacement only on acceptance | Pending |

Automated reduced-viewport checks passed, but they cannot establish native keyboard behavior. Do not mark this sheet passed without the user's actual device review.
