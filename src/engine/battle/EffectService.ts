import {BattleService} from './BattleService';
import IBattleState from './IBattleState';
import {EffectType, IDamageTargetEffect, IEffect} from './IEffect';

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

  public static damage(battleState: IBattleState, effect: IDamageTargetEffect): IBattleState {
    const enemyList = battleState.enemyList.map((c) =>
      c === effect.target ? {...c, health: c.health - effect.damage} : c);
    return {
      ...battleState,
      enemyList,
    };
  }

  public static heal(battleState: IBattleState, effect: IDamageTargetEffect): IBattleState {
    const enemyList = battleState.enemyList.map((c) =>
      c === effect.target ? {...c, health: c.health - effect.damage} : c);
    return {
      ...battleState,
      enemyList,
    };
  }
}
