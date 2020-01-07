import { DocX } from './docx';
import { Game } from './game_data/game';
import { readJson } from './json';

const GAME_NAME = 'Shotgun Wedding';

const docx = new DocX();

const game: Game = readJson(`${GAME_NAME}.json`);
for (const player of game.players) {
  docx.generate(game, player);
}
