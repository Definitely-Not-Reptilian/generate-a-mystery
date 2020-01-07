import { readFileSync } from 'fs';
import { Player } from './player';
import { Power } from './power';
import { PlotTemplate, Plot } from './plot';

const NUMBER_OF_PLAYERS = 10;
const NUMBER_OF_POWERS_PER_PLAYER = 3;
const NUMBER_OF_PLOTS = 6;

function loadJson<T>(filename: string): T {
  return JSON.parse(readFileSync(`./data/${filename}.json`, { encoding: 'UTF8' }));
}

function pickRandomAndRemove<T>(options: T[]): T {
  const index = Math.floor(Math.random() * options.length);
  return options.splice(index, 1)[0];
}

function pickNPowers(n: number, powerSet: Power[]): Power[] {
  let total = powerSet.map((p) => p.avgPerPlayer)
    .reduce((p, cv) => p + cv);
  const picked: Power[] = [];
  for (let i = 0; i < n; i++) {
    const roll = Math.random() * total;
    let currentWeight = 0;
    for (const power of powerSet) {
      if (!picked.includes(power)) {
        currentWeight += power.avgPerPlayer;
        if (currentWeight > roll) {
          picked.push(power);
          total -= power.avgPerPlayer;
          break;
        }
      }
    }
  }
  return picked;
}

// Load names
const firstNames = loadJson<string[]>('first_names');
console.log(`Loaded: ${firstNames.length} first names`);
const lastNames = loadJson<string[]>('last_names');
console.log(`Loaded: ${lastNames.length} last names`);

// Generate players
const players: Player[] = [];

for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
  const player = new Player(pickRandomAndRemove(firstNames), pickRandomAndRemove(lastNames));
  players.push(player);
}

// Load powers
const powers = loadJson<Power[]>('powers');
console.log(`Loaded: ${powers.length} powers`);
// Assign powers randomly
for (const player of players) {
  const playerPowers = pickNPowers(NUMBER_OF_POWERS_PER_PLAYER, powers);
  player.powers.push(...playerPowers);
  console.log(`${player.fullName} - ${player.fullPowers}`);
}

interface PlotsFile {
  needed: PlotTemplate[];
  optional: PlotTemplate[];
}
// Load plots
const plotTemplates = loadJson<PlotsFile>('plots');
console.log(`Loaded: ${powers.length} plots`);
const gamePlots: Plot[] = [];

function getRandomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function seedPlot(plotTemplate: PlotTemplate): Plot {
  const newPlot = new Plot(plotTemplate.name);
  const numberOfPlayersInPlot = getRandomBetween(plotTemplate.playerRangeMin, plotTemplate.playerRangeMax);
  newPlot.numberOfPlayers = numberOfPlayersInPlot;
  return newPlot;
}
for (const neededPlot of plotTemplates.needed) {
  gamePlots.push(seedPlot(neededPlot));
}
for (let i = 0; i < NUMBER_OF_PLOTS - plotTemplates.needed.length; i++) {
  gamePlots.push(seedPlot(plotTemplates.optional[Math.floor(Math.random() * plotTemplates.optional.length)]));
}

function shuffleArray(toBeSuffled): void {
  for (let i = toBeSuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ toBeSuffled[i], toBeSuffled[j] ] = [ toBeSuffled[j], toBeSuffled[i] ];
  }
}
let shuffledPlayerList = [ ...players ];
shuffleArray(shuffledPlayerList);
for (const gamePlot of gamePlots) {
  for (let i = 0; i < gamePlot.numberOfPlayers; i++) {
    gamePlot.players.push(shuffledPlayerList.pop());
    if (shuffledPlayerList.length === 0) {
      shuffledPlayerList = [ ...players ];
      shuffleArray(shuffledPlayerList);
    }
  }
}
console.log(gamePlots.map((plot) => plot.plotSummary).join('\n'));
