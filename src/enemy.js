import { ENEMY_TYPES } from './config.js';

let _nextId = 0;

export class Enemy {
  constructor(type, worldWaypoints) {
    this.id = _nextId++;
    const def = ENEMY_TYPES[type];
    this.type    = type;
    this.maxHp   = def.hp;
    this.hp      = def.hp;
    this.speed   = def.speed;
    this.reward  = def.reward;
    this.color   = def.color;
    this.size    = def.size;

    this.waypoints     = worldWaypoints;
    this.wpIndex       = 0;
    this.x             = worldWaypoints[0].x;
    this.y             = worldWaypoints[0].y;
    this.dead          = false;
    this.reachedEnd    = false;
  }

  update(dt) {
    if (this.dead) return;

    let remaining = this.speed * dt;

    while (remaining > 0 && this.wpIndex < this.waypoints.length - 1) {
      const target = this.waypoints[this.wpIndex + 1];
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist <= remaining) {
        this.x = target.x;
        this.y = target.y;
        this.wpIndex++;
        remaining -= dist;
      } else {
        this.x += (dx / dist) * remaining;
        this.y += (dy / dist) * remaining;
        remaining = 0;
      }
    }

    if (this.wpIndex >= this.waypoints.length - 1) {
      this.reachedEnd = true;
      this.dead = true;
    }
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp === 0) this.dead = true;
  }

  // 0–1 progress along path; used by towers for target prioritisation.
  get progress() {
    return this.wpIndex / (this.waypoints.length - 1);
  }
}
