import { Game } from './game_data/game';
import { classToPlain } from 'class-transformer';
import { writeJSON } from './json';
import { generatePlayersIntoGame } from './generator/player_gen';
import { generatePowersIntoGame } from './generator/power_gen';
import { generatePlotsIntoGame, assignPlotsToPlayersInGame } from './generator/plots_gen';
import { assignGoalsFromPlotsToPlayersInGame } from './generator/goals_gen';

const SEED = Math.random();
const GAME_NAME = 'Shotgun Wedding';
const NUMBER_OF_PLAYERS = 10;
const NUMBER_OF_POWERS_PER_PLAYER = 3;
const NUMBER_OF_PLOTS = NUMBER_OF_PLAYERS;

const game = new Game(GAME_NAME);
game.seed = SEED.toString();

generatePlayersIntoGame(NUMBER_OF_PLAYERS, game);

generatePowersIntoGame(NUMBER_OF_POWERS_PER_PLAYER, game);

generatePlotsIntoGame(NUMBER_OF_PLOTS, game);

assignPlotsToPlayersInGame(game);
assignGoalsFromPlotsToPlayersInGame(game);


console.log(
  game.players
    .map((plot) => plot.playerSummary)
    .join('\n'),
);

console.log(
  game.plots
    .map((plot) => plot.plotSummary)
    .join('\n'),
);

writeJSON(GAME_NAME, classToPlain(game));
