import { Player } from './player';
import { Plot } from './plot';

export class Game {
  name: string;
  players: Player[] = [];
  plots: Plot[] = [];
  constructor(name: string) {
    this.name = name;
  }
}
