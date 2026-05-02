export const TILE_SIZE = 48;
export const GRID_COLS = 20;
export const GRID_ROWS = 12;
export const CANVAS_WIDTH = TILE_SIZE * GRID_COLS;  // 960
export const CANVAS_HEIGHT = TILE_SIZE * GRID_ROWS; // 576

export const COLORS = {
  ground:           '#2a4a1a',
  groundAlt:        '#263f18',
  path:             '#c4a35a',
  pathShade:        '#b8954e',
  gridLine:         'rgba(0,0,0,0.12)',
  towerBase:        '#1e4d8c',
  towerTop:         '#4a9eff',
  towerBarrel:      '#cce4ff',
  rangePreview:     'rgba(74,158,255,0.10)',
  rangeBorder:      'rgba(74,158,255,0.35)',
  hover:            'rgba(255,255,255,0.18)',
  hoverInvalid:     'rgba(220,50,50,0.35)',
  bullet:           '#ffe066',
  enemyHP:          '#44cf6c',
  enemyHPBg:        '#1a1a1a',
};

// Path as [col, row] waypoints — enemies travel these in order.
// Enters left-center, winds in an S-curve, exits right.
export const PATH_WAYPOINTS = [
  [0,  5],
  [4,  5],
  [4,  1],
  [9,  1],
  [9,  9],
  [14, 9],
  [14, 3],
  [19, 3],
];

// All numeric values live here so tweaking gameplay never touches logic files.
export const TOWER_TYPES = {
  basic: {
    label:       'Basic',
    cost:        50,
    damage:      20,
    range:       3,    // tiles
    fireRate:    1,    // shots / sec
    bulletSpeed: 300,  // px / sec
    color:       '#4a9eff',
    baseColor:   '#1e4d8c',
  },
  // Add new tower types here; Game + UI pick them up automatically.
};

export const ENEMY_TYPES = {
  basic: {
    label:  'Grunt',
    hp:     100,
    speed:  80,   // px / sec
    reward: 10,
    color:  '#e63946',
    size:   12,   // radius px
  },
  fast: {
    label:  'Runner',
    hp:     60,
    speed:  160,
    reward: 15,
    color:  '#ff9f1c',
    size:   10,
  },
};

// Each wave is a list of concurrent groups. All groups start spawning from t=0
// within the wave; enemies from different groups are interleaved by time.
export const WAVES = [
  {
    enemies: [
      { type: 'basic', count: 8,  interval: 1.2 },
    ],
  },
  {
    enemies: [
      { type: 'basic', count: 12, interval: 1.0 },
      { type: 'fast',  count: 4,  interval: 0.9 },
    ],
  },
  {
    enemies: [
      { type: 'basic', count: 10, interval: 0.7 },
      { type: 'fast',  count: 8,  interval: 0.5 },
    ],
  },
];

export const STARTING_GOLD = 200;
export const STARTING_LIVES = 20;
