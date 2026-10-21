/* Source catalogue plus explicit user bay-arm decisions. */
window.CH149_BAY_DATA = {
  "source": {
    "file": "../CH-149-615-WB - Active Dev/config.js",
    "configVersion": 29,
    "sha256": "82E6A0F2B444A3FC49A463DE28134CFB9D26A6B5E2E9D7D7E3EF0E848F2E00F0",
    "verified": "2026-10-21",
    "field": "AC_BAY_ARMS",
    "boundaries": [
      "references/Schematic_Pax_Seats.png",
      "references/Schematic_SAR_Crew.png"
    ],
    "applicability": "Publication, revision and aircraft applicability awaiting review"
  },
  "bays": [
    {
      "id": "BAY1",
      "name": "Bay 1",
      "forward": 4875,
      "aft": 5875,
      "arm": 5375
    },
    {
      "id": "BAY2",
      "name": "Bay 2",
      "forward": 5875,
      "aft": 6875,
      "arm": 6375
    },
    {
      "id": "BAY3",
      "name": "Bay 3",
      "forward": 6875,
      "aft": 7875,
      "arm": 7375
    },
    {
      "id": "BAY4",
      "name": "Bay 4",
      "forward": 7875,
      "aft": 8875,
      "arm": 8375
    },
    {
      "id": "BAY5",
      "name": "Bay 5",
      "forward": 8875,
      "aft": 9875,
      "arm": 9375
    },
    {
      "id": "BAY55",
      "name": "Bay 5.5",
      "sourceLabel": "BAY 1/2",
      "forward": 9875,
      "aft": 10375,
      "arm": 10125
    },
    {
      "id": "BAY6",
      "name": "Bay 6",
      "forward": 10375,
      "aft": 11393,
      "arm": 10875,
      "sourceArm": 10884,
      "armDecision": {
        "by": "user",
        "date": "2026-10-20",
        "note": "Retain Bay 6 arm at 10875 mm despite its extra 18 mm of length. Station boundaries remain X10375–X11393."
      }
    },
    {
      "id": "REAR",
      "name": "Rear / ramp",
      "arm": 12893,
      "mapping": "Not mapped; no reviewed rear region"
    }
  ]
};
