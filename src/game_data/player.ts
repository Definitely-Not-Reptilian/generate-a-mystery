import { Power } from './power';
import { Goal } from './goal';
import { Expose, Exclude } from 'class-transformer';
import { Relationship } from './relationship';

export class Player {
  firstName: string;
  lastName: string;
  title: string;
  powers: Power[] = [];
  goals: Goal[] = [];
  @Exclude()
  relationships: Relationship[] = [];
  secret = 'A dark haunting secret';
  information = 'A useful tidbit';
  blurb = 'The thing about interesting people is that they are usually boring';
  traits = [ 'Boring', 'Curious', 'Smooth Talking' ];

  constructor(first: string, last: string, title: string) {
    this.firstName = first;
    this.lastName = last;
    this.title = title;
  }

  @Expose()
  get otherPeople(): string[] {
    return this.relationships
      .map((rel) => `${rel.theFriendThatsNotMe(this).title} (${rel.strength} ${rel.alignment})`);
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
    return this.otherPeople.join(',');
  }

  get playerSummary(): string {
    return `${this.fullName}(${this.title}) - ${this.otherPeopleSummary} - ${this.fullPowers} - ${this.fullGoals}`;
  }
}
