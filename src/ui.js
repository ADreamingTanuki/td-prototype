import { TOWER_TYPES } from './config.js';

export class UI {
  constructor(onTowerSelect, onStartWave) {
    this._gold      = document.getElementById('gold');
    this._lives     = document.getElementById('lives');
    this._waveLabel = document.getElementById('wave');
    this._status    = document.getElementById('status');
    this._startBtn  = document.getElementById('start-wave');
    this._towerSel  = document.getElementById('tower-select');

    this._startBtn.addEventListener('click', onStartWave);
    this._buildTowerButtons(onTowerSelect);
  }

  _buildTowerButtons(onTowerSelect) {
    for (const [key, def] of Object.entries(TOWER_TYPES)) {
      const btn = document.createElement('button');
      btn.className    = 'tower-btn';
      btn.dataset.type = key;
      btn.textContent  = `${def.label} ($${def.cost})`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tower-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onTowerSelect(key);
      });
      this._towerSel.appendChild(btn);
    }
    // Select first by default
    this._towerSel.querySelector('.tower-btn')?.classList.add('active');
  }

  sync(game) {
    const wm = game.waveManager;
    this._gold.textContent      = game.gold;
    this._lives.textContent     = game.lives;
    this._waveLabel.textContent = `${wm.currentWave} / ${wm.totalWaves}`;

    if (game.lives <= 0) {
      this._status.textContent   = 'GAME OVER';
      this._startBtn.disabled    = true;
    } else if (wm.allComplete) {
      this._status.textContent   = 'YOU WIN!';
      this._startBtn.disabled    = true;
    } else if (wm.active) {
      this._status.textContent   = 'Wave in progress…';
      this._startBtn.disabled    = true;
    } else if (wm.canStart) {
      this._status.textContent   = wm.currentWave === 0 ? 'Place towers, then start!' : 'Wave complete!';
      this._startBtn.disabled    = false;
    }
  }
}
