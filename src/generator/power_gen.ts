import { loadJson } from '../json';
import { Power } from '../game_data/power';
import { getRandomOfSeed } from '../random';
import { Game } from '../game_data/game';
import { plainToClass } from 'class-transformer';

interface PowerTemplate extends Power {

}
export function generatePowersIntoGame(numberOfPowersPerPlayer: number, game: Game): void {
  const random = getRandomOfSeed(game.seed);
  // Load powers
  const powers: Power[] = loadJson<PowerTemplate[]>('powers')
    .map((powerTemplate) => plainToClass(Power, powerTemplate));
  // Assign powers randomly
  for (const player of game.players) {
    const playerPowers = random.spiced('player_power', player.title).pickNFromWeightedListWithoutReplacement(numberOfPowersPerPlayer, powers);
    player.powers.push(...playerPowers);
  }
}
