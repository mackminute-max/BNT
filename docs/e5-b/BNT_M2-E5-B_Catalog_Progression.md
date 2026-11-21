# BNT — E5-B Provisional Catalog and Progression

All six definitions are explicitly provisional, versioned playtest content (`e5b-provisional-catalog-v1`). They use supported native tracks and retain approved names. This is not a final balanced production catalog. Registration freezes the offer and award terms; refresh cannot alter an active run.

| Championship | Qualification | Fee | Field | Events | Formats |
|---|---|---:|---:|---:|---|
| Dustroad Cup | {"reputationAtLeast":0} | 25 | 4 | 2 | Pure, Combat |
| Ironwheel Circuit | {"reputationAtLeast":100} | 75 | 5 | 3 | Pure, Combat, Pure |
| Bannerfall Series | {"reputationAtLeast":300} | 175 | 6 | 4 | Pure, Combat, Pure, Combat |
| Crownfire Grand Prix | {"reputationAtLeast":650} | 350 | 7 | 5 | Pure, Combat, Pure, Combat, Pure |
| Thunder Crown | {"reputationAtLeast":1100} | 750 | 8 | 7 | Pure, Combat, Pure, Combat, Pure, Combat, Pure |
| Iron Gauntlet | {"hasTrophy":"trophy-bannerfall"} | 500 | 8 | 4 | Pure, Combat, Pure, Combat |

Availability uses existing deterministic qualification facts. Dustroad is initially available; other templates unlock through RP or the explicit invitational trophy requirement. The full frozen schedule, fee and provisional award terms are disclosed before registration. No randomized one/two/three-offer unlock thresholds are invented: this minimal fallback is a six-template qualification board. A future procedural content policy remains an explicit content limitation.

## Frozen schedules and numerical terms

### Dustroad Cup

```json
{
  "id": "dustroad",
  "qualification": {
    "reputationAtLeast": 0
  },
  "schedule": [
    {
      "course": "Oval",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "random"
    },
    {
      "course": "Oval",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    }
  ],
  "points": [
    10,
    8,
    6,
    5
  ],
  "dnfPoints": 0,
  "terms": {
    "version": 1,
    "catalogVersion": "e5b-provisional-catalog-v1",
    "provisional": true,
    "purses": [
      [
        25,
        15,
        10,
        5
      ],
      [
        40,
        25,
        15,
        10
      ]
    ],
    "dnfPurse": 0,
    "placement": [
      150,
      100,
      70,
      40
    ],
    "titleGold": 25,
    "titleRep": 10,
    "trophyId": "trophy-dustroad",
    "xp": {
      "start": 1,
      "finish": 1,
      "podium": 1,
      "win": 1
    },
    "reputation": {
      "start": 10,
      "finish": 5,
      "podium": 10,
      "win": 15,
      "placement": [
        20,
        15,
        10,
        5
      ]
    },
    "bonuses": [],
    "rulesVersion": "e5b-awards-v1"
  }
}
```

### Ironwheel Circuit

```json
{
  "id": "ironwheel",
  "qualification": {
    "reputationAtLeast": 100
  },
  "schedule": [
    {
      "course": "Oval",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "random"
    },
    {
      "course": "Oval",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "Oval",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    }
  ],
  "points": [
    12,
    9,
    7,
    5,
    4
  ],
  "dnfPoints": 0,
  "terms": {
    "version": 1,
    "catalogVersion": "e5b-provisional-catalog-v1",
    "provisional": true,
    "purses": [
      [
        40,
        25,
        15,
        10,
        5
      ],
      [
        40,
        25,
        15,
        10,
        5
      ],
      [
        60,
        40,
        25,
        15,
        10
      ]
    ],
    "dnfPurse": 0,
    "placement": [
      350,
      220,
      150,
      100,
      50
    ],
    "titleGold": 75,
    "titleRep": 20,
    "trophyId": "trophy-ironwheel",
    "xp": {
      "start": 1,
      "finish": 1,
      "podium": 1,
      "win": 1
    },
    "reputation": {
      "start": 10,
      "finish": 5,
      "podium": 10,
      "win": 15,
      "placement": [
        20,
        15,
        10,
        5,
        0
      ]
    },
    "bonuses": [],
    "rulesVersion": "e5b-awards-v1"
  }
}
```

### Bannerfall Series

```json
{
  "id": "bannerfall",
  "qualification": {
    "reputationAtLeast": 300
  },
  "schedule": [
    {
      "course": "C01",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "random"
    },
    {
      "course": "C02",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "C03",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "C04",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    }
  ],
  "points": [
    15,
    11,
    8,
    6,
    4,
    3
  ],
  "dnfPoints": 0,
  "terms": {
    "version": 1,
    "catalogVersion": "e5b-provisional-catalog-v1",
    "provisional": true,
    "purses": [
      [
        60,
        40,
        25,
        15,
        10,
        5
      ],
      [
        60,
        40,
        25,
        15,
        10,
        5
      ],
      [
        60,
        40,
        25,
        15,
        10,
        5
      ],
      [
        90,
        60,
        40,
        25,
        15,
        10
      ]
    ],
    "dnfPurse": 0,
    "placement": [
      750,
      500,
      350,
      220,
      140,
      70
    ],
    "titleGold": 150,
    "titleRep": 35,
    "trophyId": "trophy-bannerfall",
    "xp": {
      "start": 1,
      "finish": 1,
      "podium": 1,
      "win": 1
    },
    "reputation": {
      "start": 10,
      "finish": 5,
      "podium": 10,
      "win": 15,
      "placement": [
        20,
        15,
        10,
        5,
        0,
        0
      ]
    },
    "bonuses": [],
    "rulesVersion": "e5b-awards-v1"
  }
}
```

### Crownfire Grand Prix

```json
{
  "id": "crownfire",
  "qualification": {
    "reputationAtLeast": 650
  },
  "schedule": [
    {
      "course": "mixed-rally",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "random"
    },
    {
      "course": "mixed-rally",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "mixed-rally",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "mixed-rally",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "mixed-rally",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    }
  ],
  "points": [
    18,
    13,
    9,
    6,
    4,
    3,
    2
  ],
  "dnfPoints": 0,
  "terms": {
    "version": 1,
    "catalogVersion": "e5b-provisional-catalog-v1",
    "provisional": true,
    "purses": [
      [
        90,
        60,
        40,
        25,
        15,
        10,
        5
      ],
      [
        90,
        60,
        40,
        25,
        15,
        10,
        5
      ],
      [
        90,
        60,
        40,
        25,
        15,
        10,
        5
      ],
      [
        90,
        60,
        40,
        25,
        15,
        10,
        5
      ],
      [
        140,
        90,
        60,
        40,
        25,
        15,
        10
      ]
    ],
    "dnfPurse": 0,
    "placement": [
      1500,
      1000,
      650,
      450,
      300,
      180,
      90
    ],
    "titleGold": 300,
    "titleRep": 60,
    "trophyId": "trophy-crownfire",
    "xp": {
      "start": 1,
      "finish": 1,
      "podium": 1,
      "win": 1
    },
    "reputation": {
      "start": 10,
      "finish": 5,
      "podium": 10,
      "win": 15,
      "placement": [
        20,
        15,
        10,
        5,
        0,
        0,
        0
      ]
    },
    "bonuses": [],
    "rulesVersion": "e5b-awards-v1"
  }
}
```

### Thunder Crown

```json
{
  "id": "thunder-crown",
  "qualification": {
    "reputationAtLeast": 1100
  },
  "schedule": [
    {
      "course": "Oval",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "random"
    },
    {
      "course": "C01",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "mixed-rally",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "C03",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "Oval",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "mixed-rally",
      "format": "Combat",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "C02",
      "format": "Pure",
      "laps": 1,
      "weather": "Clear",
      "grid": "standings"
    }
  ],
  "points": [
    20,
    14,
    10,
    7,
    5,
    3,
    2,
    1
  ],
  "dnfPoints": 0,
  "terms": {
    "version": 1,
    "catalogVersion": "e5b-provisional-catalog-v1",
    "provisional": true,
    "purses": [
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        225,
        150,
        105,
        70,
        45,
        30,
        20,
        10
      ]
    ],
    "dnfPurse": 0,
    "placement": [
      3500,
      2300,
      1500,
      1000,
      650,
      400,
      250,
      125
    ],
    "titleGold": 750,
    "titleRep": 100,
    "trophyId": "trophy-thunder-crown",
    "xp": {
      "start": 1,
      "finish": 1,
      "podium": 1,
      "win": 1
    },
    "reputation": {
      "start": 10,
      "finish": 5,
      "podium": 10,
      "win": 15,
      "placement": [
        20,
        15,
        10,
        5,
        0,
        0,
        0,
        0
      ]
    },
    "bonuses": [],
    "rulesVersion": "e5b-awards-v1"
  }
}
```

### Iron Gauntlet

```json
{
  "id": "iron-gauntlet",
  "qualification": {
    "hasTrophy": "trophy-bannerfall"
  },
  "schedule": [
    {
      "course": "Oval",
      "format": "Pure",
      "laps": 2,
      "weather": "Clear",
      "grid": "random"
    },
    {
      "course": "C03",
      "format": "Combat",
      "laps": 2,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "mixed-rally",
      "format": "Pure",
      "laps": 2,
      "weather": "Clear",
      "grid": "standings"
    },
    {
      "course": "mixed-rally",
      "format": "Combat",
      "laps": 2,
      "weather": "Clear",
      "grid": "standings"
    }
  ],
  "points": [
    20,
    14,
    10,
    7,
    5,
    3,
    2,
    1
  ],
  "dnfPoints": 0,
  "terms": {
    "version": 1,
    "catalogVersion": "e5b-provisional-catalog-v1",
    "provisional": true,
    "purses": [
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        150,
        100,
        70,
        45,
        30,
        20,
        10,
        5
      ],
      [
        225,
        150,
        105,
        70,
        45,
        30,
        20,
        10
      ]
    ],
    "dnfPurse": 0,
    "placement": [
      2500,
      1600,
      1100,
      700,
      450,
      300,
      180,
      90
    ],
    "titleGold": 500,
    "titleRep": 75,
    "trophyId": "trophy-iron-gauntlet",
    "xp": {
      "start": 1,
      "finish": 1,
      "podium": 1,
      "win": 1
    },
    "reputation": {
      "start": 10,
      "finish": 5,
      "podium": 10,
      "win": 15,
      "placement": [
        20,
        15,
        10,
        5,
        0,
        0,
        0,
        0
      ]
    },
    "bonuses": [],
    "rulesVersion": "e5b-awards-v1"
  }
}
```

## Award rules

All sums are validated nonnegative safe integers. Official full-precision shared placements receive the entire per-race purse and approved finish/podium/win components, with no splitting. Championship final placement uses the accepted deterministic final standings. Title-specific Gold/RP/trophies require an eligible champion. No champion leaves title awards unclaimed. DNF purse is provisionally zero. Driver and registered beasts receive provisional per-start/finish/podium/win XP; no chariot XP is invented. Only player Gold reaches the existing M2-D settlement. Race purses remain pending until final settlement.

Run and Legacy catalogs each contain seven distinct placeholder definitions; an offer deterministically selects three without consuming native RNG. Selection effects are explicitly deferred. Their IDs, names and effect status are defined in `src/career/championships/reward-offers.js`. No Legacy Points or slot upgrades are granted.
