import { Player } from './player';
import { Transform, Exclude } from 'class-transformer';
import { Game } from './game';

export class Item {
  name: string;
  description: string;
  limitedUses: number;
  @Exclude()
  startsWithPlayer: Player;
  duplicates: number = 1;
  @Transform((_startsWith, item: Item) => item.startsWithPlayer.title, { toPlainOnly: true })
  startsWith: string;
  type: string = 'Item';

  get printableType(): string {
    return this.type.toUpperCase();
  }

  get printableUsages(): string {
    if (!this.limitedUses || this.limitedUses < 1) {
      return '';
    }
    const os = Array(this.limitedUses)
      .fill('O')
      .join(' ');
    return `Usages: ${os}`;
  }

  rehydrate(game: Game): void {
    this.startsWithPlayer = game.getPlayer(this.startsWith, true);
  }
}
