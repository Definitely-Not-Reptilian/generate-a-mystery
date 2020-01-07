import { Power } from './power';
import { Goal } from './goal';

export class Player {
  firstName: string;
  lastName: string;
  powers: Power[] = [];
  goals: Goal[] = [];

  constructor(first: string, last: string) {
    this.firstName = first;
    this.lastName = last;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get fullPowers(): string {
    return this.powers.map((power) => power.name)
      .join(', ');
  }
}
