import { loadJson } from '../json';
import { Player } from '../game_data/player';
import { getRandomOfSeed } from '../random';
import { Game } from '../game_data/game';

export function generatePlayersIntoGame(titles: string[], optionalTitles: string[], game: Game): void {
  const random = getRandomOfSeed(game.seed);
  // Load names
  const firstNames = loadJson<string[]>('first_names');
  const lastNames = loadJson<string[]>('last_names');

  // Generate players
  for (const title of titles) {
    const namesRandom = random.spiced('names', title);
    const player = new Player(namesRandom.pickRandomAndRemove(firstNames), namesRandom.pickRandomAndRemove(lastNames), title);
    game.players.push(player);
  }
  for (const optionalTitle of optionalTitles) {
    const namesRandom = random.spiced('names', optionalTitle);
    const player = new Player(namesRandom.pickRandomAndRemove(firstNames), namesRandom.pickRandomAndRemove(lastNames), optionalTitle, true);
    game.players.push(player);
  }
}