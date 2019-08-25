import {BattleService} from './BattleService';
import IBattleState from './IBattleState';
import {IdentifiedCharacter} from './ICharacter';
import {EffectType, ITargetedAmountEffect} from './IEffect';

export default class EffectService {

  // this is effectively a "factory" that executes a function based on the effect's effectType enum
  public static activate(battleState: IBattleState): IBattleState {
    if (!battleState.activeEffect) { return battleState; }
    switch (battleState.activeEffect.effectType) {

      case EffectType.DAMAGE_TARGET:
        return EffectService.damage(battleState, battleState.activeEffect);

      case EffectType.HEAL_TARGET:
        return EffectService.heal(battleState, battleState.activeEffect);

      case EffectType.DRAW_EFFECT:
        return BattleService.draw(battleState);

      // these are dummy testing effects that do nothing
      case EffectType.UN_TARGETED:
      case EffectType.TARGETED:
      default:
        return battleState;
    }
  }

  private static damage(
    battleState: IBattleState,
    effect: ITargetedAmountEffect,
  ): IBattleState {
    if (!effect.targetId) { return battleState; }
    if (effect.amount <= 0) { return battleState; }

    const target = battleState.characterMap[effect.targetId];
    if (!target) { return battleState; }

    const damage = effect.amount < target.health ? effect.amount : target.health;
    const health = target.health - damage;
    const newCharacterState = {
      ...target,
      health,
    };

    return this.updateCharacter(battleState, newCharacterState);
  }

  private static heal(battleState: IBattleState, effect: ITargetedAmountEffect): IBattleState {
    if (!effect.targetId) { return battleState; }
    if (effect.amount <= 0) { return battleState; }

    const target = battleState.characterMap[effect.targetId];
    if (!target) { return battleState; }

    const totalHealed = target.health + effect.amount;
    const health =  totalHealed < target.maxHealth ? totalHealed : target.maxHealth;
    const newCharacterState = {
      ...target,
      health,
    };

    return this.updateCharacter(battleState, newCharacterState);
  }

  private static updateCharacter(battleState: IBattleState, character: IdentifiedCharacter) {
    const characterMap = {
      ...battleState.characterMap,
      [character.id]: character,
    };

    return {
      ...battleState,
      characterMap,
    };
  }
}
