import {Effect, EffectType} from './IEffect';
import UnTargetedEffect from './UnTargetedEffect';

// export interface ICard {
//   name: string;
//   effectList: Effect[];
// }

export interface ITargetedCard {
  name: string;
  TARGETED: EffectType.TARGETED;
  effectList: Effect[];
}

export interface IUnTargetedCard {
  name: string;
  UN_TARGETED: EffectType.UN_TARGETED;
  effectList: UnTargetedEffect[];
}

export type Card = ITargetedCard | IUnTargetedCard;
