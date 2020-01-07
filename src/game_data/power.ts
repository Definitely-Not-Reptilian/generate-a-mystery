import { Exclude } from 'class-transformer';

export class Power {
  name: string;
  description: string;
  usages: number;
  @Exclude({ toPlainOnly: true })
  weight: number;
}
