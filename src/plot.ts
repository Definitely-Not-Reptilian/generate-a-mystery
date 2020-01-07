import { Player } from './player';
import { Item } from './item';

export interface PlotTemplate {
  name: string;
  playerRangeMin: number;
  playerRangeMax: number;
}

export class Plot {
  constructor(public name: string) { }
  numberOfPlayers: number;
  players: Player[] = [];
  items: Item[] = [];

  get plotSummary(): string {
    const playerNameList = this.players
      .map((p) => p.fullName)
      .join(', ');
    return `${this.name}: ${playerNameList}`;
  }
}
