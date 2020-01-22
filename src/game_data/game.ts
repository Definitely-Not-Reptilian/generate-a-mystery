import { Player } from './player';
import { Plot } from './plot';
import { Relationship } from './relationship';
import { Type, Exclude } from 'class-transformer';
import { Item } from './item';

export class Game {
  name: string;
  @Type(() => Player)
  players: Player[] = [];
  @Type(() => Plot)
  plots: Plot[] = [];
  seed: string;
  @Type(() => Item)
  items: Item[] = [];

  @Exclude()
  allRelationships: Map<string, Relationship> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  get printableItems(): Item[] {
    const printables = [];
    for (const item of this.items) {
      // tslint:disable-next-line:newline-per-chained-call
      printables.push(...Array(item.duplicates).fill(item));
    }
    return printables;
  }
  public getPlayer(title: string, nullable: boolean = false) {
    const player = this.players.find((player) => player.title === title);
    if (!player && !nullable) {
      console.warn('tried to get player', title, 'but they dont exist. A probable misspelling');
    }
    return player;
  }
  rehydrate() {
    for (const plot of this.plots) {
      plot.rehydrate(this);
    }
    for (const player of this.players) {
      player.rehydrate(this);
    }
    for (const item of this.items) {
      item.rehydrate(this);
    }
  }
}
