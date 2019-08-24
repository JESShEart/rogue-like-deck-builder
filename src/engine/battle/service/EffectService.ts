import IBattleState from '../IBattleState';
import {EffectType, IEffect, ITargetedAmountEffect} from '../IEffect';
import {BattleService} from './BattleService';
import CharacterService from './CharacterService';

export default class EffectService {

  // this is effectively a "factory" that executes a function based on the effect's effectType enum
  public static activate(battleState: IBattleState, effect: IEffect): IBattleState {
    switch (effect.effectType) {

      case EffectType.DAMAGE_TARGET:
        return EffectService.damage(battleState, effect);

      case EffectType.HEAL_TARGET:
        return EffectService.heal(battleState, effect);

      case EffectType.DRAW_EFFECT:
        return BattleService.draw(battleState);

      // these are dummy testing effects that do nothing
      case EffectType.UN_TARGETED:
      case EffectType.TARGETED:
      default:
        return battleState;
    }
  }

  public static damage(
    battleState: IBattleState,
    effect: ITargetedAmountEffect,
  ): IBattleState {
    if (!effect.targetId) { return battleState; }
    if (effect.amount <= 0) { return battleState; }

    const target = CharacterService.getCharacterById(battleState, effect.targetId);
    if (!target) { return battleState; }

    const damage = effect.amount < target.health ? effect.amount : target.health;
    const health = target.health - damage;
    const newCharacterState = {
      ...target,
      health,
    };

    return CharacterService.update(battleState, newCharacterState);
  }

  public static heal(battleState: IBattleState, effect: ITargetedAmountEffect): IBattleState {
    if (!effect.targetId) { return battleState; }
    if (effect.amount <= 0) { return battleState; }

    const target = CharacterService.getCharacterById(battleState, effect.targetId);
    if (!target) { return battleState; }

    const totalHealed = target.health + effect.amount;
    const health =  totalHealed < target.maxHealth ? totalHealed : target.maxHealth;
    const newCharacterState = {
      ...target,
      health,
    };

    return CharacterService.update(battleState, newCharacterState);
  }
}
