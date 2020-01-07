import { readFileSync } from 'fs';
import { Player } from './player';

const NUMBER_OF_PLAYERS = 10;

function loadJson<T>(filename: string): T {
  return JSON.parse(readFileSync(`./data/${filename}.json`, { encoding: 'UTF8' }));
}

function pickRandomAndRemove<T>(options: T[]): T {
  const index = Math.floor(Math.random() * options.length);
  return options.splice(index, 1)[0];
}

// Load names
const firstNames = loadJson<string[]>('first_names');
console.log(`Loaded: ${firstNames.length} first names`);
const lastNames = loadJson<string[]>('last_names');
console.log(`Loaded: ${lastNames.length} last names`);

// Generate players
const players = [];

for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
  const player = new Player(pickRandomAndRemove(firstNames), pickRandomAndRemove(lastNames));
  players.push(player);
  console.log(`Created player: ${player.fullName}`);
}


