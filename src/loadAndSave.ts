import 'reflect-metadata';
import { Game } from './game_data/game';
import { readJson, writeJSON } from './json';
import { plainToClass, classToPlain } from 'class-transformer';

const GAME_NAME = 'Shotgun Wedding';
//this is, like, for migrating json to newer formats

const game: Game = plainToClass(Game, readJson<any>(`${GAME_NAME}.json`));
game.rehydrate();
writeJSON(GAME_NAME, classToPlain(game));