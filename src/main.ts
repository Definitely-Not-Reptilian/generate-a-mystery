import 'reflect-metadata';
import { Game } from './game_data/game';
import { classToPlain } from 'class-transformer';
import { writeYaml } from './json';
import { generatePlayersIntoGame } from './generator/player_gen';
import { generatePowersIntoGame } from './generator/power_gen';
import { generatePlotsIntoGame, assignPlotsToPlayersInGame } from './generator/plots_gen';
import { assignGoalsFromPlotsToPlayersInGame, assignBonusGoalsFromOtherPeopleInGame } from './generator/goals_gen';
import { assignRelationshipsToPlayersInGame } from './generator/relationship_gen';

const GAME_NAME = 'Shotgun Wedding';
const TITLES = [ 'Groom', 'Bride', 'Maid of Honor', 'Flowergirl', 'Marriage Officiant', 'Best Man', 'Wedding Planner', 'Bride\'s Father', 'Groom\'s Mother', 'Drunk Uncle' ];
const TITLES_OPTIONAL = [ 'Dog', 'Photographer' ];
const SEED = GAME_NAME + '324234234';
const NUMBER_OF_POWERS_PER_PLAYER = 3;
const NUMBER_OF_PLOTS = TITLES.length;
const MINIMUM_NUMBER_OF_STRONG_RELATIONSHIPS_LOWER = 2;
const MINIMUM_NUMBER_OF_STRONG_RELATIONSHIPS_UPPER = 3;
const MINIMUM_NUMBER_OF_WEAK_RELATIONSHIPS_LOWER = 2;
const MINIMUM_NUMBER_OF_WEAK_RELATIONSHIPS_UPPER = 4;
const game = new Game(GAME_NAME);
game.seed = SEED.toString();

generatePlayersIntoGame(TITLES, TITLES_OPTIONAL, game);

generatePowersIntoGame(NUMBER_OF_POWERS_PER_PLAYER, game);

generatePlotsIntoGame(NUMBER_OF_PLOTS, game);

assignPlotsToPlayersInGame(game);
assignGoalsFromPlotsToPlayersInGame(game);
assignRelationshipsToPlayersInGame([ MINIMUM_NUMBER_OF_STRONG_RELATIONSHIPS_LOWER, MINIMUM_NUMBER_OF_STRONG_RELATIONSHIPS_UPPER ], [ MINIMUM_NUMBER_OF_WEAK_RELATIONSHIPS_LOWER, MINIMUM_NUMBER_OF_WEAK_RELATIONSHIPS_UPPER ], game);
assignBonusGoalsFromOtherPeopleInGame(game);

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

writeYaml(GAME_NAME, classToPlain(game));
