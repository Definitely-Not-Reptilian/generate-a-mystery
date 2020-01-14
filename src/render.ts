import 'reflect-metadata';
import { DocX } from './docx';
import { Game } from './game_data/game';
import { readJson, readYaml } from './json';
import { plainToClass } from 'class-transformer';
import { readFileSync, writeFileSync } from 'fs';

const GAME_NAME = 'Shotgun Wedding';

const docx = new DocX();

const game: Game = plainToClass(Game, readYaml<any>(`${GAME_NAME}.yaml`));
game.rehydrate();
for (const player of game.players) {
  docx.generatePlayer(game, player);
}
docx.generateItems(game);

interface GraphData {
  nodes: {name: string}[];
  links: {source: number, target: number, strength: string}[];
  groups: {id: string, leaves: number[]}[];
}
const graph: GraphData = {
  nodes: game.players.map((p) => ({ name: p.title })),
  links: [],
  groups: [],
};
for (const rel of game.allRelationships.values()) {
  graph.links.push({ source: game.players.indexOf(rel.players[0]), target: game.players.indexOf(rel.players[1]), strength: rel.strength});
}
const incitingIncident = game.plots[0];
graph.groups.push({ id: incitingIncident.name, leaves: incitingIncident.players.map((p) => game.players.indexOf(p)) });
const renderTemplate = readFileSync('graph_render.html', { encoding: 'utf8' });
writeFileSync('output/graph_render.html', renderTemplate.replace('/*%%%DATA%%%*/', JSON.stringify(graph)), { encoding: 'utf8' });
