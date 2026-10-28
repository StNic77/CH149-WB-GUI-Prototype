# Detail reference-image applicability — 28 October 2026

The user agreed this matrix for the standard role configurations:

| Detail view | SAR-3 Pax | SAR-10 Pax | Transport / CASEVAC |
|---|---|---|---|
| SAR Cabinet | Available | Available | Unavailable |
| Forward Shelves | Available | Available | Available |
| Port / Starboard Aft | Available | Unavailable | Unavailable |
| Ramp Shelves | Available | Available | Available |

Unavailable image choices are greyed out in View and related navigation, with explanatory helper text. Direct/programmatic access to their equipment or location controls shows an image-unavailable explanation rather than the misleading SAR-3 picture. Contents editors, aircraft configuration/loading and W&B remain accessible. The 2D return remains available. No Role Config retains its existing reference-browsing behavior; this matrix applies to the four named standard configurations.

This is reference-image applicability, not physical equipment eligibility. A custom installed cabinet or cot still has its controls and contributes according to the existing aircraft model even when its detail picture is unavailable. Existing source imagery is unchanged. Generated Port Aft trials remain outside the repository and are not used for SAR-10 Pax.

## Future Ramp Shelves imagery correction

The existing Ramp Shelves reference is sufficiently representative for all configurations and remains available. It omits permanently installed passenger seats P2/P3. Following configuration-image trials, replace or update that image to depict those seats regardless of selected role. This omission does not remove their installation state or W&B contributions. No image generation or replacement is included in this increment.

## Implementation and validation

detail-image-policy.js contains the presentation-only policy. View buttons, the mobile selector, image access points and cot/basket detail links follow it. Image loading also checks the policy, so indirect navigation cannot bypass it. Image-free locations continue through the existing contents menus, without changing calculation state.

The dedicated browser check covers the complete matrix, disabled choices/helpers, direct navigation, unchanged aircraft state/W&B, overhead contents and cot access, retained ramp imagery and restored SAR-3 shortcuts at desktop, portrait/landscape tablet and phone sizes. Related detail-return/fuel, image-workspace and session-navigation checks exercise existing flows. Browser emulation does not establish physical iPad acceptance. Changes remain local for the user's combined commit/push.
