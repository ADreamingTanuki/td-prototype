import { TILE_SIZE, TOWER_TYPES } from './config.js';

let _nextId = 0;

export class Tower {
  constructor(type, col, row) {
    this.id    = _nextId++;
    const def  = TOWER_TYPES[type];
    this.type      = type;
    this.col       = col;
    this.row       = row;
    this.x         = col * TILE_SIZE + TILE_SIZE / 2;
    this.y         = row * TILE_SIZE + TILE_SIZE / 2;
    this.range     = def.range * TILE_SIZE;
    this.damage    = def.damage;
    this.fireRate  = def.fireRate;
    this.color     = def.color;
    this.baseColor = def.baseColor;
    this.bulletSpeed = def.bulletSpeed;
    this.cooldown  = 0;
    this.facing    = -Math.PI / 2; // default: point up
    this.bullets   = [];
  }

  update(dt, enemies) {
    this.cooldown = Math.max(0, this.cooldown - dt);

    for (const b of this.bullets) b.update(dt);
    this.bullets = this.bullets.filter(b => !b.done);

    if (this.cooldown === 0) {
      const target = this._pickTarget(enemies);
      if (target) {
        this.facing = Math.atan2(target.y - this.y, target.x - this.x);
        this.bullets.push(new Bullet(this.x, this.y, target, this.damage, this.bulletSpeed));
        this.cooldown = 1 / this.fireRate;
      }
    }
  }

  // Prioritise the enemy furthest along the path (first to leak).
  _pickTarget(enemies) {
    let best = null;
    let bestProgress = -1;
    for (const e of enemies) {
      if (e.dead) continue;
      if (Math.hypot(e.x - this.x, e.y - this.y) <= this.range) {
        if (e.progress > bestProgress) {
          bestProgress = e.progress;
          best = e;
        }
      }
    }
    return best;
  }
}

class Bullet {
  constructor(x, y, target, damage, speed) {
    this.x      = x;
    this.y      = y;
    this.target = target;
    this.damage = damage;
    this.speed  = speed;
    this.done   = false;
  }

  update(dt) {
    if (this.done) return;
    if (this.target.dead) { this.done = true; return; }

    const dx   = this.target.x - this.x;
    const dy   = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);
    const move = this.speed * dt;

    if (dist <= move) {
      this.target.takeDamage(this.damage);
      this.done = true;
    } else {
      this.x += (dx / dist) * move;
      this.y += (dy / dist) * move;
    }
  }
}
