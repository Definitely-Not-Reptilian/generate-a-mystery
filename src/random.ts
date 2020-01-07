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
  sampleOne<T>(toBeSampled: T[]): T {
    return toBeSampled[Math.floor(this.randomAmount() * toBeSampled.length)];
  }

  pickNPowers(n: number, powerSet: Power[]): Power[] {
    let total = powerSet
      .map((p) => p.avgPerPlayer)
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

  getReductionSampleableList<T>(list: T[], reductionCoefficient: number = 3): RandomWeightedList<T> {
    return new RandomWeightedList(list, reductionCoefficient, this);
  }
}
export class RandomWeightedList<T> {
  private total: number;
  private weights: number[];
  constructor(private list: T[], private reductionCoefficient: number, private random: Random) {
    this.total = list.length * 10;
    this.weights = list.map(() => 10);
  }
  public getNextThing(): T {
    const roll = this.random.randomRoll() * this.total;
    let currentWeight = 0;
    for (let i = 0; i < this.list.length; i++) {
      currentWeight += this.weights[i];
      if (currentWeight > roll) {
        const oldWeight = this.weights[i];
        this.weights[i] = this.weights[i] / this.reductionCoefficient;
        this.total -= oldWeight - this.weights[i];
        return this.list[i];
      }
    }
  }
}

const randomsBySeed: {[seed: string]: Random } = {};
export function getRandomOfSeed(seed: string) {
  if (!randomsBySeed[seed]) {
    randomsBySeed[seed] = new Random(seed);
  }
  return randomsBySeed[seed];
}