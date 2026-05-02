import { WAVES } from './config.js';
import { Enemy } from './enemy.js';

export class WaveManager {
  constructor(worldWaypoints) {
    this.worldWaypoints  = worldWaypoints;
    this.waveIndex       = 0;   // next wave to start (0-based)
    this.active          = false;
    this.allComplete     = false;
    this._spawnQueue     = [];
    this._spawnTimer     = 0;
  }

  get totalWaves()   { return WAVES.length; }
  get currentWave()  { return this.waveIndex; }
  get canStart()     { return !this.active && this.waveIndex < this.totalWaves; }

  startWave() {
    if (!this.canStart) return;
    this._spawnQueue = this._buildQueue(WAVES[this.waveIndex]);
    this._spawnTimer = 0;
    this.active      = true;
    this.waveIndex++;
  }

  // Build a time-sorted spawn list. All groups within a wave are concurrent:
  // each group's timer starts at 0, then entries are merged and sorted.
  _buildQueue(waveDef) {
    const queue = [];
    for (const group of waveDef.enemies) {
      let t = 0;
      for (let i = 0; i < group.count; i++) {
        queue.push({ time: t, type: group.type });
        t += group.interval;
      }
    }
    return queue.sort((a, b) => a.time - b.time);
  }

  // Call once per frame. Mutates `enemies` array directly.
  update(dt, enemies) {
    if (!this.active) return;

    this._spawnTimer += dt;

    while (this._spawnQueue.length > 0 && this._spawnQueue[0].time <= this._spawnTimer) {
      enemies.push(new Enemy(this._spawnQueue.shift().type, this.worldWaypoints));
    }

    if (this._spawnQueue.length === 0 && enemies.length === 0) {
      this.active = false;
      if (this.waveIndex >= this.totalWaves) this.allComplete = true;
    }
  }
}
