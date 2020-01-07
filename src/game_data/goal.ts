import { Plot } from './plot';
import { Exclude } from 'class-transformer';

export class Goal {
  public name: string;
  public description: string;
  @Exclude()
  public plot?: Plot;
}
