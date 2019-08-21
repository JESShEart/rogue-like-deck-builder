import Character from '../character';
import IBattleState from './BattleState';

export enum EffectType {
  UN_TARGETED,
  TARGETED,
}

export interface IUnTargetedEffect {
  UN_TARGETED: EffectType.UN_TARGETED;
  activate: (battleState: IBattleState) => IBattleState;
}

export interface ITargetedEffect {
  TARGETED: EffectType.TARGETED;
  activate: (battleState: IBattleState, target: Character) => IBattleState;
}

export type Effect = ITargetedEffect | IUnTargetedEffect;

export interface IQueuedUnTargetedEffect {
  effect: IUnTargetedEffect;
}

export interface IQueuedTargetedEffect {
  effect: ITargetedEffect;
  target: Character;
}

export type QueuedEffect = IQueuedUnTargetedEffect | IQueuedTargetedEffect;
