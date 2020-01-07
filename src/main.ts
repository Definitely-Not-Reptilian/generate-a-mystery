import 'reflect-metadata';
import { Game } from './game_data/game';
import { classToPlain } from 'class-transformer';
import { writeJSON } from './json';
import { generatePlayersIntoGame } from './generator/player_gen';
import { generatePowersIntoGame } from './generator/power_gen';
import { generatePlotsIntoGame, assignPlotsToPlayersInGame } from './generator/plots_gen';
import { assignGoalsFromPlotsToPlayersInGame } from './generator/goals_gen';
import { assignRelationshipsToPlayersInGame } from './generator/relationship_gen';

const GAME_NAME = 'Shotgun Wedding';
const TITLES = [ 'Groom', 'Bride', 'Bridesmaid', 'Flowergirl', 'Priest', 'Best man', 'Wedding Planner', 'Bride\'s Father', 'Groom\'s Mother', 'Drunk Uncle' ];
const SEED = GAME_NAME;
const NUMBER_OF_POWERS_PER_PLAYER = 3;
const NUMBER_OF_PLOTS = TITLES.length;
const NUMBER_OF_STRONG_RELATIONSHIPS = 3;
const NUMBER_OF_WEAK_RELATIONSHIPS = 3;
const game = new Game(GAME_NAME);
game.seed = SEED.toString();

generatePlayersIntoGame(TITLES, game);

generatePowersIntoGame(NUMBER_OF_POWERS_PER_PLAYER, game);

generatePlotsIntoGame(NUMBER_OF_PLOTS, game);

assignPlotsToPlayersInGame(game);
assignGoalsFromPlotsToPlayersInGame(game);
assignRelationshipsToPlayersInGame(NUMBER_OF_STRONG_RELATIONSHIPS, NUMBER_OF_WEAK_RELATIONSHIPS, game);
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
