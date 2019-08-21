import Character from '../character';
import IBattleState from './BattleState';
import {ITargetedEffect} from './IEffect';

export default class TargetedEffect implements ITargetedEffect {
  public readonly TARGETED;
  public readonly activate: (battleState: IBattleState, target: Character) => IBattleState;

  constructor(activate: (battleState: IBattleState, target: Character) => IBattleState) {
    this.activate = activate;
  }
}
