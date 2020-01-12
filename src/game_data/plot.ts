import { Player } from './player';
import { Item } from './item';
import { Transform, Exclude, Type } from 'class-transformer';
import { Game } from './game';

export interface PlotTemplate {
  name: string;
  playerRangeMin: number;
  playerRangeMax: number;
}

export class Plot {
  constructor(public name: string) { }

  @Exclude()
  numberOfPlayers: number;

  @Exclude({})
  players: Player[] = [];

  @Transform((_titles, plot: Plot) => plot.players.map((player) => player.title), { toPlainOnly: true })
  playerTitles: string[] = [];

  get plotSummary(): string {
    const playerNameList = this.players.length === 0 ? this.playerTitles : this.players.map((p) => p.title);
    return `${this.name}: ${playerNameList.join(', ')}`;
  }

  rehydrate(game: Game): void {
    this.numberOfPlayers = this.playerTitles.length;
    for (const playerTitle of this.playerTitles) {
      this.players.push(game.getPlayer(playerTitle));
    }
  }
}
