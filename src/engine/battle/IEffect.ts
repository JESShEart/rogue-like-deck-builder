import Character from '../character';

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
  readonly target?: Character;
}

export interface IDamageTargetEffect {
  readonly effectType: EffectType.DAMAGE_TARGET | EffectType.HEAL_TARGET;
  readonly damage: number;
  readonly target?: Character;
}

export type IEffect =
  IUnTargetedEffect |
  ITargetedEffect |
  IDamageTargetEffect;
