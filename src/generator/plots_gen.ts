import { loadJson } from '../json';
import { Player } from '../game_data/player';
import { PlotTemplate, Plot } from '../game_data/plot';
import { getRandomOfSeed, Random } from '../random';
import { Game } from '../game_data/game';

interface PlotsFile {
  needed: PlotTemplate[];
  optional: PlotTemplate[];
}
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
let currentIndexOfAlphabet = 0;
function getNextLetter(): string {
  const letter = ALPHABET[currentIndexOfAlphabet].toUpperCase();
  currentIndexOfAlphabet = (currentIndexOfAlphabet + 1) % ALPHABET.length;
  return letter;
}
function seedPlot(random: Random, plotTemplate: PlotTemplate): Plot {
  const newPlot = new Plot(`${plotTemplate.name} ${getNextLetter()}`);
  const numberOfPlayersInPlot = random.spiced('players_in_plot', newPlot.name).getRandomBetween(plotTemplate.playerRangeMin, plotTemplate.playerRangeMax);
  newPlot.numberOfPlayers = numberOfPlayersInPlot;
  return newPlot;
}

export function generatePlotsIntoGame(numberOfPlots: number, game: Game): void {
  const random = getRandomOfSeed(game.seed);
  // Load plots
  const plotTemplates = loadJson<PlotsFile>('plots');

  for (const neededPlot of plotTemplates.needed) {
    game.plots.push(seedPlot(random, neededPlot));
  }
  const reductionSamplableList = random.spiced('number_of_optional_plots').getReductionSampleableList(plotTemplates.optional, 3);
  for (let i = 0; i < numberOfPlots - plotTemplates.needed.length; i++) {
    game.plots.push(seedPlot(random, reductionSamplableList.getNextThing()));
  }
}

function reseedPoolOfPlayers(random: Random, players: Player[]): Player[] {
  const shuffledPlayerList = [ ...players ];
  random.shuffleArray(shuffledPlayerList);
  return shuffledPlayerList;
}
export function assignPlotsToPlayersInGame(game: Game): void {
  const random = getRandomOfSeed(game.seed).spiced('player_plot_assign');
  let randomPlayerPool = reseedPoolOfPlayers(random, game.players);
  for (const plot of game.plots) {
    const duplicatePicksInPlot: Player[] = [];
    while (plot.players.length < plot.numberOfPlayers) {
      const selectedPlayer = randomPlayerPool.pop();
      if (plot.players.includes(selectedPlayer)) {
        duplicatePicksInPlot.push(selectedPlayer);
      } else {
        plot.players.push(selectedPlayer);
      }
      if (randomPlayerPool.length === 0) {
        randomPlayerPool = reseedPoolOfPlayers(random, game.players);
      }
    }
    randomPlayerPool.push(...duplicatePicksInPlot);
  }
}
