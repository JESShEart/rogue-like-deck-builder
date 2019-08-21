import IBattleState from './BattleState';
import {IUnTargetedEffect} from './IEffect';

export default class UnTargetedEffect implements IUnTargetedEffect {
  public readonly UN_TARGETED;
  public readonly activate: (battleState: IBattleState) => IBattleState;

  constructor(activate: (battleState: IBattleState) => IBattleState) {
    this.activate = activate;
  }
}
