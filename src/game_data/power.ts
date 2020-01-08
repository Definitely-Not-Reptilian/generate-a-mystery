import { Exclude } from 'class-transformer';
import { times } from 'lodash';

export class Power {
  name: string;
  description: string;
  usages: number;
  @Exclude({ toPlainOnly: true })
  weight: number;

  get usagesAsCircles(): string {
    return times(this.usages, () => 'O')
      .join(' ');
  }
}
