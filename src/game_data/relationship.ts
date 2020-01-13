import { Player } from './player';
import { Exclude } from 'class-transformer';

export enum RelationshipStrength {
  STRONG = 'Strong',
  WEAK = 'Weak',
}

export enum RelationshipAlignment {
  POSITIVE = '+',
  NEGATIVE = '-',
}
interface IRelationship {
  strength: RelationshipStrength;
  alignment: RelationshipAlignment;
}

export class Relationship implements IRelationship {
  players: [Player, Player] = [ null, null ];

  words: [string, string] = [ null, null ];

  constructor(player1: Player, player2: Player, public strength: RelationshipStrength, public alignment: RelationshipAlignment) {
    this.players[0] = player1;
    this.players[1] = player2;
  }

  theFriendThatsNotMe(me: Player): Player {
    return this.players[0] === me ? this.players[1] : this.players[0];
  }
  get uniqueString(): string {
    const playersString = this.players
      .map((p) => p.title)
      .sort();
    return `${playersString}${this.strength}${this.alignment}`;
  }

  getMyWordsAboutThem(me: Player): string {
    return this.players[0] === me ? this.words[1] : this.words[0];
  }

  setMyWordsAboutThem(me: Player, words: string): void {
    if (this.players[0] === me) {
      this.words[1] = words;
    } else {
      this.words[0] = words;
    }
  }
}
export class OtherPerson implements IRelationship {
  @Exclude()
  public playerName: string;
  constructor(
    playerName: string,
    public playerTitle: string,
    public strength: RelationshipStrength,
    public alignment: RelationshipAlignment,
    public words: string,
  ) {
    this.playerName = playerName;
  }

  static makeFromMe(me: Player, relationship: Relationship): OtherPerson {
    const notMe = relationship.theFriendThatsNotMe(me);
    const words = relationship.getMyWordsAboutThem(me);
    return new OtherPerson(notMe.fullName, notMe.title, relationship.strength, relationship.alignment, words);
  }
}
