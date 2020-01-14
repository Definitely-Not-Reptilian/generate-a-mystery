import 'reflect-metadata';
import { Game } from './game_data/game';
import { writeYaml, readYaml } from './json';
import { plainToClass, classToPlain } from 'class-transformer';

const GAME_NAME = 'Shotgun Wedding';
//this is, like, for migrating json to newer formats

const game: Game = plainToClass(Game, readYaml<any>(`${GAME_NAME}.yaml`));
game.rehydrate();
writeYaml(GAME_NAME, classToPlain(game));
