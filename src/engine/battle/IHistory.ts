import IBattleState from './IBattleState';

export default interface IHistory {
  readonly timeTraveling: boolean;
  readonly keep: boolean;
  readonly index: number;
  readonly timeline: IBattleState[];
}

export class InitialHistory implements IHistory {
  public readonly timeTraveling: boolean = false;
  public readonly keep: boolean = true;
  public readonly index: number = 0;
  public readonly timeline: IBattleState[];

  constructor(initialBattleState: IBattleState) {
    this.timeline = [initialBattleState];
  }
}
