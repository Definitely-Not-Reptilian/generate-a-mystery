export class Player {
  firstName: string;
  lastName: string;

  constructor(first: string, last: string) {
    this.firstName = first;
    this.lastName = last;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}