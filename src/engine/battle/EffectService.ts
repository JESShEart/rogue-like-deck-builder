import {BattleService} from './BattleService';
import IBattle from './IBattle';
import {IdentifiedCharacter} from './ICharacter';
import {EffectType, ITargetedAmountEffect} from './IEffect';

export default class EffectService {

  // this is effectively a "factory" that executes a function based on the effect's effectType enum
  public static activate(battle: IBattle): IBattle {
    if (!battle.activeEffect) { return battle; }
    switch (battle.activeEffect.effectType) {

      case EffectType.DAMAGE_TARGET:
        return EffectService.damage(battle, battle.activeEffect);

      case EffectType.HEAL_TARGET:
        return EffectService.heal(battle, battle.activeEffect);

      case EffectType.DRAW_EFFECT:
        return BattleService.draw(battle);

      // these are dummy testing effects that do nothing
      case EffectType.UN_TARGETED:
      case EffectType.TARGETED:
      default:
        return battle;
    }
  }

  private static damage(
    battle: IBattle,
    effect: ITargetedAmountEffect,
  ): IBattle {
    if (!effect.targetId) { return battle; }
    if (effect.amount <= 0) { return battle; }

    const target = battle.characterMap[effect.targetId];
    if (!target) { return battle; }

    const damage = effect.amount < target.health ? effect.amount : target.health;
    const health = target.health - damage;
    const newCharacter = {
      ...target,
      health,
    };

    return this.updateCharacter(battle, newCharacter);
  }

  private static heal(battle: IBattle, effect: ITargetedAmountEffect): IBattle {
    if (!effect.targetId) { return battle; }
    if (effect.amount <= 0) { return battle; }

    const target = battle.characterMap[effect.targetId];
    if (!target) { return battle; }

    const totalHealed = target.health + effect.amount;
    const health =  totalHealed < target.maxHealth ? totalHealed : target.maxHealth;
    const newCharacter = {
      ...target,
      health,
    };

    return this.updateCharacter(battle, newCharacter);
  }

  private static updateCharacter(battle: IBattle, character: IdentifiedCharacter) {
    const characterMap = {
      ...battle.characterMap,
      [character.id]: character,
    };

    return {
      ...battle,
      characterMap,
    };
  }
}
