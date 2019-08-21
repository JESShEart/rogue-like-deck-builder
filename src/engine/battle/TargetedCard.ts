import {ITargetedCard} from './ICard';
import {Effect} from './IEffect';

export default class TargetedCard implements ITargetedCard {
  public readonly TARGETED;
  public readonly name;
  public readonly effectList;

  constructor(name, effectList: Effect[]) {
    this.name = name;
    this.effectList = effectList;
  }

}
