import { Exclude } from 'class-transformer';
import { times } from 'lodash';

export class Power {
  name: string;
  description: string;
  usages: number;
  @Exclude({ toPlainOnly: true })
  weight: number;

  get usagesAsCircles(): string {
    if (this.usages === -1) {
      return 'Special';
    }
    return times(this.usages, () => 'O')
      .join(' ');
  }
}
