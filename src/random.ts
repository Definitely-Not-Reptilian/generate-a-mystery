import * as seedrandom from 'seedrandom';
import { Power } from './game_data/power';

export class Random {

  randomPick: seedrandom.prng;
  randomRoll: seedrandom.prng;
  randomShuffle: seedrandom.prng;
  randomBetween: seedrandom.prng;
  randomAmount: seedrandom.prng;

  constructor(seed: string) {
    this.randomPick = seedrandom(`${seed}.pick`);
    this.randomRoll = seedrandom(`${seed}.roll`);
    this.randomShuffle = seedrandom(`${seed}.shuffle`);
    this.randomBetween = seedrandom(`${seed}.between`);
    this.randomAmount = seedrandom(`${seed}.amount`);
  }

  pickRandomAndRemove<T>(options: T[]): T {
    const index = Math.floor(this.randomPick() * options.length);
    return options.splice(index, 1)[0];
  }

  pickNPowers(n: number, powerSet: Power[]): Power[] {
    let total = powerSet.map((p) => p.avgPerPlayer)
      .reduce((p, cv) => p + cv);
    const picked: Power[] = [];
    for (let i = 0; i < n; i++) {
      const roll = this.randomRoll() * total;
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

  shuffleArray(toBeSuffled): void {
    for (let i = toBeSuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.randomShuffle() * (i + 1));
      [ toBeSuffled[i], toBeSuffled[j] ] = [ toBeSuffled[j], toBeSuffled[i] ];
    }
  }

  getRandomBetween(min: number, max: number): number {
    return Math.floor(this.randomBetween() * (max - min + 1)) + min;
  }
}
