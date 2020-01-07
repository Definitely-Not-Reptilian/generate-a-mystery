import { loadJson } from '../json';
import { Player } from '../game_data/player';
import { getRandomOfSeed } from '../random';
import { Game } from '../game_data/game';

export function generatePlayersIntoGame(titles: string[], game: Game): void {
  const random = getRandomOfSeed(game.seed);
  // Load names
  const firstNames = loadJson<string[]>('first_names');
  const lastNames = loadJson<string[]>('last_names');

  // Generate players
  for (const title of titles) {
    const player = new Player(random.pickRandomAndRemove(firstNames), random.pickRandomAndRemove(lastNames), title);
    game.players.push(player);
  }
}
