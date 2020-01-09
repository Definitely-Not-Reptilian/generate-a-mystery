import { Power } from './power';
import { Goal } from './goal';
import { Expose, Exclude, Type } from 'class-transformer';
import { Relationship, OtherPerson } from './relationship';
import { Game } from './game';
import { orderBy } from 'lodash';

export class Player {
  firstName: string;
  lastName: string;
  title: string;
  @Type(() => Power)
  powers: Power[] = [];
  @Type(() => Goal)
  goals: Goal[] = [];
  @Exclude()
  relationships: Relationship[] = [];
  secret = 'A dark haunting secret';
  information = 'A useful tidbit';
  blurb = 'The thing about interesting people is that they are usually boring';
  traits = [ 'Boring', 'Curious', 'Smooth Talking' ];
  optional: boolean;

  @Exclude()
  private _otherPeople: OtherPerson[] = [];

  constructor(first: string, last: string, title: string, optional: boolean = false) {
    this.firstName = first;
    this.lastName = last;
    this.title = title;
    this.optional = optional;
  }
  @Type(() => OtherPerson)
  @Expose()
  get otherPeople(): OtherPerson[] {
    if (this._otherPeople.length !== 0 || this.relationships.length === 0) {
      return this._otherPeople;
    }
    return orderBy(this.relationships.map((rel) => OtherPerson.makeFromMe(this, rel)), ['strength', 'playerTitle']);
  }

  set otherPeople(otherPeople: OtherPerson[]) {
    this._otherPeople = otherPeople;
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get fullPowers(): string {
    return this.powers.map((power) => power.name)
      .join(', ');
  }

  get fullGoals(): string {
    return this.goals.map((goal) => goal.name)
      .join(', ');
  }

  get otherPeopleSummary(): string {
    return this.otherPeople
      .map((o) => `${o.playerTitle}(${o.strength}${o.alignment})`)
      .join(',');
  }

  get playerSummary(): string {
    return `${this.fullName}(${this.title}) - ${this.otherPeopleSummary} - ${this.fullPowers} - ${this.fullGoals}`;
  }

  rehydrate(game: Game): void {
    for (const otherPerson of this._otherPeople) {
      const otherPlayer = game.getPlayer(otherPerson.playerTitle);
      let relationship = new Relationship(this, otherPlayer, otherPerson.strength, otherPerson.alignment);
      const relationshipHash = relationship.uniqueString;
      if (game.allRelationships.has(relationshipHash)) {
        relationship = game.allRelationships.get(relationshipHash);
      } else {
        game.allRelationships.set(relationshipHash, relationship);
        const otherPeopleDetailsAboutMe = otherPlayer.otherPeople.find((p) => p.playerTitle === this.title);
        if (otherPeopleDetailsAboutMe == null || otherPeopleDetailsAboutMe.alignment !== relationship.alignment || otherPeopleDetailsAboutMe.strength !== relationship.strength) {
          console.warn(`The relationship from ${this.title} to ${otherPlayer.title} does not seem to match. this could screw some stuff up`);
        }
      }
      this.relationships.push(relationship);
    }
    this._otherPeople = []; // relationships set, go back to calculated
  }
}
