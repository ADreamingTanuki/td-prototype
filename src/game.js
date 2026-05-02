import { TILE_SIZE, TOWER_TYPES } from './config.js';
import { Map }         from './map.js';
import { Tower }       from './tower.js';
import { WaveManager } from './wave.js';
import { Renderer }    from './renderer.js';

export class Game {
  constructor(canvas, ui) {
    this.canvas  = canvas;
    this.ui      = ui;
    this.map     = new Map();
    this.renderer = new Renderer(canvas, this.map);
    this.waveManager = new WaveManager(this.map.worldWaypoints);

    this.enemies          = [];
    this.towers           = [];
    this.gold             = 0;   // set in init()
    this.lives            = 0;
    this.selectedType     = Object.keys(TOWER_TYPES)[0];
    this._occupiedTiles   = new Set();  // "col,row"

    this._hoverCol = -1;
    this._hoverRow = -1;
    this._lastTime = 0;
    this._running  = false;

    this._bindInput();
  }

  init(startingGold, startingLives) {
    this.gold  = startingGold;
    this.lives = startingLives;
  }

  start() {
    this._running  = true;
    this._lastTime = performance.now();
    requestAnimationFrame(ts => this._loop(ts));
    this.ui.sync(this);
  }

  selectTowerType(type) {
    this.selectedType = type;
  }

  startWave() {
    if (this.waveManager.canStart) {
      this.waveManager.startWave();
      this.ui.sync(this);
    }
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _loop(timestamp) {
    if (!this._running) return;
    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.1); // cap at 100 ms
    this._lastTime = timestamp;
    this._update(dt);
    this._render();
    requestAnimationFrame(ts => this._loop(ts));
  }

  _update(dt) {
    // Spawn phase (mutates this.enemies)
    this.waveManager.update(dt, this.enemies);

    // Update enemies first so positions are fresh for tower targeting
    for (const e of this.enemies) e.update(dt);
    for (const t of this.towers)  t.update(dt, this.enemies);

    // Resolve dead enemies: award gold or deduct lives
    for (const e of this.enemies) {
      if (!e.dead) continue;
      if (e.reachedEnd) {
        this.lives = Math.max(0, this.lives - 1);
      } else {
        this.gold += e.reward;
      }
    }

    this.enemies = this.enemies.filter(e => !e.dead);

    this.ui.sync(this);
  }

  _render() {
    this.renderer.clear();
    this.renderer.drawMap();

    const valid = this._canPlace(this._hoverCol, this._hoverRow);
    this.renderer.drawPlacementPreview(this._hoverCol, this._hoverRow, this.selectedType, valid);

    this.renderer.drawTowers(this.towers);
    this.renderer.drawBullets(this.towers);
    this.renderer.drawEnemies(this.enemies);
  }

  _canPlace(col, row) {
    if (!this.map.inBounds(col, row)) return false;
    if (this.map.isPath(col, row))    return false;
    if (this._occupiedTiles.has(`${col},${row}`)) return false;
    return this.gold >= TOWER_TYPES[this.selectedType].cost;
  }

  _placeTower(col, row) {
    if (!this._canPlace(col, row)) return;
    this.gold -= TOWER_TYPES[this.selectedType].cost;
    this.towers.push(new Tower(this.selectedType, col, row));
    this._occupiedTiles.add(`${col},${row}`);
    this.ui.sync(this);
  }

  _bindInput() {
    this.canvas.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width  / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this._hoverCol = Math.floor((e.clientX - rect.left)  * scaleX / TILE_SIZE);
      this._hoverRow = Math.floor((e.clientY - rect.top)   * scaleY / TILE_SIZE);
      this.canvas.style.cursor = this._canPlace(this._hoverCol, this._hoverRow)
        ? 'crosshair' : 'default';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this._hoverCol = -1;
      this._hoverRow = -1;
    });

    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width  / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const col = Math.floor((e.clientX - rect.left) * scaleX / TILE_SIZE);
      const row = Math.floor((e.clientY - rect.top)  * scaleY / TILE_SIZE);
      this._placeTower(col, row);
    });
  }
}
