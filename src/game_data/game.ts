import { Player } from './player';
import { Plot } from './plot';
import { Relationship } from './relationship';
import { Type, Exclude } from 'class-transformer';

export class Game {
  name: string;
  @Type(() => Player)
  players: Player[] = [];
  @Type(() => Plot)
  plots: Plot[] = [];
  seed: string;

  @Exclude()
  allRelationships: Map<string, Relationship> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  public getPlayer(title: string) {
    return this.players.find((player) => player.title === title);
  }
  rehydrate() {
    for (const plot of this.plots) {
      plot.rehydrate(this);
    }
    for (const player of this.players) {
      player.rehydrate(this);
    }
  }
}
