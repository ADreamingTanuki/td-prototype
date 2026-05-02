import { CANVAS_WIDTH, CANVAS_HEIGHT, STARTING_GOLD, STARTING_LIVES } from './config.js';
import { Game } from './game.js';
import { UI }   from './ui.js';

const canvas = document.getElementById('game-canvas');
canvas.width  = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const game = new Game(canvas, null); // UI set below after its DOM callbacks wire up
const ui   = new UI(
  type  => game.selectTowerType(type),
  ()    => game.startWave(),
);

// Back-reference so Game can call ui.sync()
game.ui = ui;
game.init(STARTING_GOLD, STARTING_LIVES);
game.start();
