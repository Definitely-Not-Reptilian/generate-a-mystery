import { Plot } from './plot';
import { Exclude } from 'class-transformer';

export class Goal {
  @Exclude()
  public plot?: Plot;

  constructor(public name: string, public description: string, plot?: Plot) {
    this.plot = plot;
  }
}
