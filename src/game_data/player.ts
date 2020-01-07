import { Power } from './power';
import { Goal } from './goal';
import { Expose } from 'class-transformer';

export class Player {
  firstName: string;
  lastName: string;
  powers: Power[] = [];
  goals: Goal[] = [];
  secret = 'A dark haunting secret';
  information = 'A useful tidbit';
  title = 'An interesting individual';
  blurb = 'The thing about interesting people is that they are usually boring';
  traits = [ 'Boring', 'Curious', 'Smooth Talking' ];

  constructor(first: string, last: string) {
    this.firstName = first;
    this.lastName = last;
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get fullPowers(): string {
    return this.powers.map((power) => power.name)
      .join(', ');
  }
}
