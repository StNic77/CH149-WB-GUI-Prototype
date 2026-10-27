# Cabin workspace demo

Start with **No Role Config** to build a setup, or select a standard role.

1. Select a floor cell to see its options. Cargo placement starts only after choosing Cargo.
2. Use B1 or B2 Stbd to install the SAR Cabinet. Click its installed picture to open the compartments.
3. Select a seat to assign crew or a passenger. Person markers distinguish crew and passengers; C3 uses the existing cockpit jump panel.
4. In SAR-3, click the basket, cot or Stokes litter. Try moving the basket or deploying the Stokes. An occupied item must be cleared before removal or incompatible movement.
5. Transport shows an internal raft at B3 Stbd Fwd; CASEVAC shows one at B4 Stbd Aft. Each requires its installed fitting. Neither role starts with a Sea Tray.
6. In CASEVAC, click a green litter rack or choose **CASEVAC litters**. Add patients to its tiers. Forward racks have Top/Middle/Bottom; aft racks have Middle/Bottom only. Clear patients before removing a rack. Rack weight includes its litters; patients are separate loads.
7. Open the shelf and overhead close-ups and select their reviewed compartments.
8. Enable **Bays review** to inspect boundaries. Review lines appear over equipment. Turn review off to return to floor/item editing.

Use **Cargo** to show/hide installed cargo and bay-weight symbols independently of Seats and Live equipment. Single boxes represent individual cargo; grouped boxes represent bay/ramp weight. Click a symbol or **Cargo & bay loads** to edit, relocate or remove a specific entry. Four individual cargo entries are available; each cabin bay and the single ramp area can also have its own weight entry. Selecting another cell in a bay opens that bay's existing weight rather than replacing it. The Ramp menu offers individual cargo placed anywhere on the ramp, plus a separate ramp bay weight at the configured 12893 mm arm. Drag the draft marker before saving; a known-arm override is also available. Ramp cargo arms must be X11393–X14393. The ramp menu, cargo editor and sidebar show combined loading warnings against 350 kg closed, 450 kg open and the source 450 kg·m ramp hinge moment. Stowed Stokes is included; shelves and their contents are excluded. Overloads remain editable. Ramp point arms are linear estimates between the approved hinge and aft image marks, not surveyed positions. Bays Review labels each station boundary above or below the plan, including the ramp end at X14393.

The inspector's totals are cargo/bay-only weight, moment and load CG, not an aircraft result. Symbols may be offset for selection when entries overlap; their assigned positions/arms remain unchanged. Hiding the layer leaves all records and contributions intact.

Live equipment pictures follow edits. Turning **Live equipment** off shows the original role reference. Session edits reset on refresh or applying a role; custom floor load records currently survive role switching within a session.

This is a graphical prototype for discussion, not operational loading approval. Whole-aircraft calculations, full fit/clearance validation and session save/restore are unfinished. In particular, CASEVAC rack controls validate patient dependency; complete rack-versus-other-equipment footprint rules remain to be reviewed. Aft top tiers are deliberately omitted; the possible overhead-stowage explanation is not confirmed.

Cargo uses reusable slots **1–4**; removing a load frees its slot. Bay weights use bay names. Ramp symbols are green when the current ramp checks pass and red with an exclamation mark when combined loading raises a caution; grey cabin symbols have no connected limit check yet. Select a symbol to see the issue at the top of its menu. **Load Planning** has a **Remove** button beside each cargo or bay-weight entry.
