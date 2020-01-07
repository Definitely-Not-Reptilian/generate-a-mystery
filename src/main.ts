
import { Player } from './player';
import { Power } from './power';
import { PlotTemplate, Plot } from './plot';
import { Game } from './game';
import { classToPlain } from 'class-transformer';
import { loadJson, writeJSON } from './json';
import { Random } from './random';

const GAME_NAME = 'Shotgun Wedding';
const SEED = GAME_NAME;
const NUMBER_OF_PLAYERS = 10;
const NUMBER_OF_POWERS_PER_PLAYER = 3;
const NUMBER_OF_PLOTS = 6;

const random = new Random(SEED);
const game = new Game(GAME_NAME);

// Load names
const firstNames = loadJson<string[]>('first_names');
const lastNames = loadJson<string[]>('last_names');

// Generate players
for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
  const player = new Player(random.pickRandomAndRemove(firstNames), random.pickRandomAndRemove(lastNames));
  game.players.push(player);
}

// Load powers
const powers = loadJson<Power[]>('powers');
// Assign powers randomly
for (const player of game.players) {
  const playerPowers = random.pickNPowers(NUMBER_OF_POWERS_PER_PLAYER, powers);
  player.powers.push(...playerPowers);
  console.log(`${player.fullName} - ${player.fullPowers}`);
}

interface PlotsFile {
  needed: PlotTemplate[];
  optional: PlotTemplate[];
}
// Load plots
const plotTemplates = loadJson<PlotsFile>('plots');

function seedPlot(plotTemplate: PlotTemplate): Plot {
  const newPlot = new Plot(plotTemplate.name);
  const numberOfPlayersInPlot = random.getRandomBetween(plotTemplate.playerRangeMin, plotTemplate.playerRangeMax);
  newPlot.numberOfPlayers = numberOfPlayersInPlot;
  return newPlot;
}
for (const neededPlot of plotTemplates.needed) {
  game.plots.push(seedPlot(neededPlot));
}
for (let i = 0; i < NUMBER_OF_PLOTS - plotTemplates.needed.length; i++) {
  game.plots.push(seedPlot(plotTemplates.optional[Math.floor(random.randomAmount() * plotTemplates.optional.length)]));
}

let shuffledPlayerList = [ ...game.players ];
random.shuffleArray(shuffledPlayerList);
for (const gamePlot of game.plots) {
  for (let i = 0; i < gamePlot.numberOfPlayers; i++) {
    gamePlot.players.push(shuffledPlayerList.pop());
    if (shuffledPlayerList.length === 0) {
      shuffledPlayerList = [ ...game.players ];
      random.shuffleArray(shuffledPlayerList);
    }
  }
}
console.log(
  game.plots
    .map((plot) => plot.plotSummary)
    .join('\n'),
);

writeJSON(GAME_NAME, classToPlain(game));
