import { Player } from './player';
import { Item } from './item';
import { Transform, Exclude } from 'class-transformer';

export interface PlotTemplate {
  name: string;
  playerRangeMin: number;
  playerRangeMax: number;
}

export class Plot {
  constructor(public name: string) { }

  @Exclude()
  numberOfPlayers: number;

  @Transform((players: Player[]) => players.map((player) => player.fullName), { toPlainOnly: true })
  players: Player[] = [];

  items: Item[] = [];

  get plotSummary(): string {
    const playerNameList = this.players
      .map((p) => p.fullName)
      .join(', ');
    return `${this.name}: ${playerNameList}`;
  }
}
