import * as seedrandom from 'seedrandom';

export class Random {

  numberMaker: seedrandom.prng;

  constructor(public seed: string) {
    this.numberMaker = seedrandom(this.seed);
  }

  spiced(...newSpice: string[]): Random {
    return new Random(`${this.seed}${newSpice.join()}`);
  }

  chanceRoll(odds: number): boolean {
    return this.numberMaker() < odds;
  }

  pickRandomAndRemove<T>(options: T[]): T {
    const index = Math.floor(this.numberMaker() * options.length);
    return options.splice(index, 1)[0];
  }
  sampleOne<T>(toBeSampled: T[]): T {
    return toBeSampled[Math.floor(this.numberMaker() * toBeSampled.length)];
  }

  pickNFromWeightedListWithoutReplacement<T extends { weight: number }>(n: number, set: T[]): T[] {
    let total = set.reduce((p, cv) => p + cv.weight, 0);
    const picked: T[] = [];
    for (let i = 0; i < n; i++) {
      const roll = this.numberMaker() * total;
      let currentWeight = 0;
      for (const item of set) {
        if (!picked.includes(item)) {
          currentWeight += item.weight;
          if (currentWeight > roll) {
            picked.push(item);
            total -= item.weight;
            break;
          }
        }
      }
    }
    return picked;
  }

  shuffleArray(toBeSuffled): void {
    for (let i = toBeSuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.numberMaker() * (i + 1));
      [ toBeSuffled[i], toBeSuffled[j] ] = [ toBeSuffled[j], toBeSuffled[i] ];
    }
  }

  getRandomBetween(min: number, max: number): number {
    return Math.floor(this.numberMaker() * (max - min + 1)) + min;
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
    const roll = this.random.numberMaker() * this.total;
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
