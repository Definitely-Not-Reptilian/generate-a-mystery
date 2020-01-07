import { Player } from './player';

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
}
export class OtherPerson implements IRelationship {
  constructor(
    public playerTitle: string,
    public strength: RelationshipStrength,
    public alignment: RelationshipAlignment,
  ) { }

  static makeFromMe(me: Player, relationship: Relationship): OtherPerson {
    return new OtherPerson(relationship.theFriendThatsNotMe(me).title, relationship.strength, relationship.alignment);
  }
}
