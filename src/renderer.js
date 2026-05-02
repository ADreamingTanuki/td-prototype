import { TILE_SIZE, GRID_COLS, GRID_ROWS, COLORS, TOWER_TYPES } from './config.js';

export class Renderer {
  constructor(canvas, map) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.map    = map;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawMap() {
    const { ctx, map } = this;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;
        if (map.isPath(c, r)) {
          ctx.fillStyle = (c + r) % 2 === 0 ? COLORS.path : COLORS.pathShade;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        } else {
          ctx.fillStyle = (c + r) % 2 === 0 ? COLORS.ground : COLORS.groundAlt;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = COLORS.gridLine;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  // Highlights the tile under the cursor with a placement preview.
  drawPlacementPreview(col, row, towerType, valid) {
    if (!this.map.inBounds(col, row)) return;
    const { ctx } = this;
    const x = col * TILE_SIZE;
    const y = row * TILE_SIZE;

    if (valid) {
      const cx    = x + TILE_SIZE / 2;
      const cy    = y + TILE_SIZE / 2;
      const range = TOWER_TYPES[towerType].range * TILE_SIZE;

      ctx.beginPath();
      ctx.arc(cx, cy, range, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.rangePreview;
      ctx.fill();
      ctx.strokeStyle = COLORS.rangeBorder;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.fillStyle = valid ? COLORS.hover : COLORS.hoverInvalid;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  }

  drawTowers(towers) {
    for (const t of towers) this._drawTower(t);
  }

  _drawTower(tower) {
    const { ctx } = this;
    const x  = tower.col * TILE_SIZE;
    const y  = tower.row * TILE_SIZE;
    const cx = x + TILE_SIZE / 2;
    const cy = y + TILE_SIZE / 2;
    const pad = 8;

    // Base
    ctx.fillStyle = tower.baseColor;
    ctx.fillRect(x + pad, y + pad, TILE_SIZE - pad * 2, TILE_SIZE - pad * 2);

    // Inner square
    ctx.fillStyle = tower.color;
    const inner = pad + 4;
    ctx.fillRect(x + inner, y + inner, TILE_SIZE - inner * 2, TILE_SIZE - inner * 2);

    // Barrel (rotates toward last target)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tower.facing + Math.PI / 2); // +π/2 because barrel drawn pointing "up" in local space
    ctx.fillStyle = COLORS.towerBarrel;
    const bw = 5;
    const bh = TILE_SIZE / 2 - 2;
    ctx.fillRect(-bw / 2, -(bh + 2), bw, bh);
    ctx.restore();
  }

  drawBullets(towers) {
    const { ctx } = this;
    ctx.fillStyle = COLORS.bullet;
    for (const tower of towers) {
      for (const b of tower.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawEnemies(enemies) {
    for (const e of enemies) {
      if (!e.dead) this._drawEnemy(e);
    }
  }

  _drawEnemy(enemy) {
    const { ctx } = this;
    const r = enemy.size;

    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, r, 0, Math.PI * 2);
    ctx.fill();

    // HP bar
    const bw = r * 2.6;
    const bh = 3;
    const bx = enemy.x - bw / 2;
    const by = enemy.y - r - 7;
    ctx.fillStyle = COLORS.enemyHPBg;
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = COLORS.enemyHP;
    ctx.fillRect(bx, by, bw * (enemy.hp / enemy.maxHp), bh);
  }
}
