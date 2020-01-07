import { loadJson } from '../json';
import { Power } from '../game_data/power';
import { getRandomOfSeed } from '../random';
import { Game } from '../game_data/game';

export function generatePowersIntoGame(numberOfPowersPerPlayer: number, game: Game): void {
  const random = getRandomOfSeed(game.seed);
  // Load powers
  const powers = loadJson<Power[]>('powers');
  // Assign powers randomly
  for (const player of game.players) {
    const playerPowers = random.pickNPowers(numberOfPowersPerPlayer, powers);
    player.powers.push(...playerPowers);
  }
}
