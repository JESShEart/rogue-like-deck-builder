import {ICharacter} from './ICharacter';

export enum EffectType {
  UN_TARGETED,
  TARGETED,
  DAMAGE_TARGET,
  HEAL_TARGET,
  DRAW_EFFECT,
}

export interface IUnTargetedEffect {
  readonly effectType: EffectType.UN_TARGETED | EffectType.DRAW_EFFECT;
}

export interface ITargetedEffect {
  readonly effectType: EffectType.TARGETED;
  readonly target?: ICharacter;
}

export interface ITargetedAmountEffect {
  readonly effectType: EffectType.DAMAGE_TARGET | EffectType.HEAL_TARGET;
  readonly amount: number;
  readonly target?: ICharacter;
}

export type IEffect =
  IUnTargetedEffect |
  ITargetedEffect |
  ITargetedAmountEffect;
