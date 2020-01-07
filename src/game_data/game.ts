import { Player } from './player';
import { Plot } from './plot';

export class Game {
  name: string;
  players: Player[] = [];
  plots: Plot[] = [];
  seed: string;

  constructor(name: string) {
    this.name = name;
  }
}
