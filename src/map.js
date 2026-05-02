import { GRID_COLS, GRID_ROWS, PATH_WAYPOINTS, TILE_SIZE } from './config.js';

export class Map {
  constructor() {
    this.cols = GRID_COLS;
    this.rows = GRID_ROWS;
    this.waypoints = PATH_WAYPOINTS;
    this.pathSet = new Set();       // "col,row" strings for O(1) lookup
    this.worldWaypoints = [];       // pixel-space centers for enemy movement
    this._build();
  }

  _build() {
    // Trace horizontal/vertical segments between consecutive waypoints.
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      const [c1, r1] = this.waypoints[i];
      const [c2, r2] = this.waypoints[i + 1];
      const dc = Math.sign(c2 - c1);
      const dr = Math.sign(r2 - r1);
      let c = c1, r = r1;
      while (c !== c2 || r !== r2) {
        this.pathSet.add(`${c},${r}`);
        c += dc;
        r += dr;
      }
      this.pathSet.add(`${c2},${r2}`);
    }

    this.worldWaypoints = this.waypoints.map(([col, row]) => ({
      x: col * TILE_SIZE + TILE_SIZE / 2,
      y: row * TILE_SIZE + TILE_SIZE / 2,
    }));
  }

  isPath(col, row) {
    return this.pathSet.has(`${col},${row}`);
  }

  inBounds(col, row) {
    return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
  }
}
