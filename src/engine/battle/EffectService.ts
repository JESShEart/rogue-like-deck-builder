import {BattleService} from './BattleService';
import CharacterService from './CharacterService';
import IBattleState from './IBattleState';
import {EffectType, IEffect, ITargetedAmountEffect} from './IEffect';

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

  public static damage(battleState: IBattleState, effect: ITargetedAmountEffect): IBattleState {
    if (!effect.target) { return battleState; }
    if (effect.amount <= 0) { return battleState; }

    const damage = effect.amount < effect.target.health ? effect.amount : effect.target.health;
    const health = effect.target.health - damage;
    const newCharacterState = {
      ...effect.target,
      health,
    };

    return CharacterService.update(battleState, effect.target, newCharacterState);
  }

  public static heal(battleState: IBattleState, effect: ITargetedAmountEffect): IBattleState {
    if (!effect.target) { return battleState; }
    if (effect.amount <= 0) { return battleState; }

    const totalHealed = effect.target.health + effect.amount;
    const health =  totalHealed < effect.target.maxHealth ? totalHealed : effect.target.maxHealth;
    const newCharacterState = {
      ...effect.target,
      health,
    };

    return CharacterService.update(battleState, effect.target, newCharacterState);
  }
}
