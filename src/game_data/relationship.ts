import { Player } from './player';
import { Transform } from 'class-transformer';

export enum RelationshipStrength {
  STRONG = 'Strong',
  WEAK = 'Weak',
}

export enum RelationshipAlignment {
  POSITIVE = '+',
  NEGATIVE = '-',
}

export class Relationship {
  strength: RelationshipStrength;
  alignment: RelationshipAlignment;

  @Transform((player: Player) => player.title, { toPlainOnly: true })
  player1: Player;
  @Transform((player: Player) => player.title, { toPlainOnly: true })
  player2: Player;

  theFriendThatsNotMe(me: Player): Player {
    return this.player1 === me ? this.player2 : this.player1;
  }
}
