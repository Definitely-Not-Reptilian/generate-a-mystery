import 'reflect-metadata';
import { DocX } from './docx';
import { Game } from './game_data/game';
import { readJson } from './json';
import { plainToClass } from 'class-transformer';

const GAME_NAME = 'Shotgun Wedding';

const docx = new DocX();

const game: Game = plainToClass(Game, readJson<any>(`${GAME_NAME}.json`));
game.rehydrate();
for (const player of game.players) {
  docx.generate(game, player);
}
