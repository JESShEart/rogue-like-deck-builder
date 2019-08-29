import IBattle from './IBattle';

export default interface IHistory {
  readonly timeTraveling: boolean;
  readonly index: number;
  readonly timeline: IBattle[];
}

export class InitialHistory implements IHistory {
  public readonly timeTraveling: boolean = false;
  public readonly index: number = 0;
  public readonly timeline: IBattle[];

  constructor(initialBattle: IBattle) {
    this.timeline = [initialBattle];
  }
}
