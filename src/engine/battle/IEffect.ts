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
  readonly targetId?: number;
}

export interface ITargetedAmountEffect {
  readonly effectType: EffectType.DAMAGE_TARGET | EffectType.HEAL_TARGET;
  readonly amount: number;
  readonly targetId?: number;
}

export type IEffect =
  IUnTargetedEffect |
  ITargetedEffect |
  ITargetedAmountEffect;
