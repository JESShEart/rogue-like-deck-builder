import {IUnTargetedCard} from './ICard';
import {Effect} from './IEffect';

export default class UnTargetedCard implements IUnTargetedCard {
  public readonly UN_TARGETED;
  public readonly name;
  public readonly effectList;

  constructor(name, effectList: Effect[]) {
    this.name = name;
    this.effectList = effectList;
  }

}
