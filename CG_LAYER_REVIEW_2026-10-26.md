# Cabin-centreline CG view — 26 October 2026

Local trial; not published. This replaces the earlier weight-versus-CG chart presentation.

Enable Layers → Longitudinal CG. Select Takeoff range or Landing range to calculate that condition's allowable forward/aft CG band. The band and both CG markers are projected onto the actual aircraft view using the existing approved station calibration. Both markers stay on the aircraft centreline. Labels show their names, CG, Fwd/Mid/Aft band and weight. Each marker retains the CG status calculated for its own weight, independently of which allowable band is selected.

The full weight-versus-CG polygon and its axes are removed. Only the selected allowable band and its transverse boundaries are shaded on the cabin. Takeoff and landing values continue to use the existing calculations; landing uses the preferred reserve, capped to fuel aboard with a shortfall shown. Manual departure tanks and the source's mapped landing-fuel assumption are unchanged.

Focus CG zooms to 400% and centres the selected band; Whole cabin returns to the complete image. The actual marker separation is preserved even when CGs nearly coincide. Both markers and the band track image pan/zoom and role registration. Labels keep a readable size and avoid the side controls.

CG mode suppresses Seats, Bay Cells, Bay Boundaries, Equipment Symbols and occupancy badges; mission equipment can remain visible. Previous layer selections return on exit. No installed equipment, people, fuel or other loading state is changed by display controls.

The band height reuses the existing cabin display strip for visual clipping inside the cabin view. It is not a surveyed lateral floor or clearance boundary. Longitudinal positions use the approved station calibration; source pictures, weights, arms and calibration files are unchanged.

Verification covers calibrated marker/boundary positions and common centreline, selected-weight limit interpolation, pan/zoom registration, focus/reset, layer restoration, no loading-state mutation, reserve shortfall, manual fuel and five desktop/tablet/phone sizes. Related gesture, control, fuel-retention and ribbon checks are included. The first implementation is intended for user visual review and adjustment.

## Live enlarged CG strip

A live strip below the aircraft now replaces the duplicated condition-value cards. Takeoff and estimated landing each have an enlarged allowable band at their own exact weight, a CG marker, current weight/CG, and forward/aft margin or explicit distance beyond a limit. Selecting a strip row also selects the allowable band drawn on the cabin.

Both rows use one arm scale covering the complete source envelope, with padding. Normal AUW changes move the markers and alter the permissible bands; they do not stretch each row to make its allowable band fill the width. The scale expands if an outlying CG would otherwise be hidden. This scale is a magnified CG display, separate from the true image/station projection above.

The expandable Full weight-versus-CG envelope view shows both source polygons, both condition points and their horizontal weight-specific slices. It stays open through live loading changes. The full polygon is available here rather than over the aircraft.

The 301 kg ramp-load regression uses an individual ramp entry at 12893 mm. In the recorded SAR-3 fixture, takeoff moves from CG 8342 mm to 8438 mm, while the aft limit changes from about 8406 mm to 8395 mm. The strip shows 43 mm aft of limit. Removing the load restores the original CG/status. Tests also check shared-scale stability, expansion for outlying CG, and graph updates/preserved expansion through changes.
