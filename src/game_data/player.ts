import { Power } from './power';
import { Goal } from './goal';
import { Expose, Exclude, Type } from 'class-transformer';
import { Relationship, OtherPerson } from './relationship';

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

  @Exclude()
  private _otherPeople: OtherPerson[] = [];

  constructor(first: string, last: string, title: string) {
    this.firstName = first;
    this.lastName = last;
    this.title = title;
  }
  @Type(() => OtherPerson)
  @Expose()
  get otherPeople(): OtherPerson[] {
    if (this._otherPeople.length !== 0) {
      return this._otherPeople;
    }
    return this.relationships.map((rel) => OtherPerson.makeFromMe(this, rel));
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
}
