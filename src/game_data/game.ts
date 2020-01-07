import { Player } from './player';
import { Plot } from './plot';
import { Relationship } from './relationship';
import { Exclude } from 'class-transformer';

export class Game {
  name: string;
  players: Player[] = [];
  plots: Plot[] = [];
  @Exclude()
  relationships: Relationship[] = [];
  seed: string;

  constructor(name: string) {
    this.name = name;
  }
}
