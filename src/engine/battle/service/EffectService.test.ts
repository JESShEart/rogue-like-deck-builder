import IBattleState from '../IBattleState';
import {CharacterType} from '../ICharacter';
import {EffectType, ITargetedAmountEffect} from '../IEffect';
import EffectService from './EffectService';

const baseState: IBattleState = {
  deck: [],
  discardPile: [],
  effectLog: [],
  effectQueue: [],
  enemyList: [{id: 2, characterType: CharacterType.ENEMY, health: 100, maxHealth: 100}],
  hand: [],
  hero: {id: 1, characterType: CharacterType.HERO, health: 100, maxHealth: 100},
};

test('damage enemy', () => {
  const effect: ITargetedAmountEffect = {
    amount: 90,
    effectType: EffectType.DAMAGE_TARGET,
    targetId: baseState.enemyList[0].id,
  };
  const result = EffectService.activate(baseState, effect);
  expect(result.enemyList[0].health).toBe(10);
});

test('damage hero', () => {
  const effect: ITargetedAmountEffect = {
    amount: 90,
    effectType: EffectType.DAMAGE_TARGET,
    targetId: baseState.hero.id,
  };
  const result = EffectService.activate(baseState, effect);
  expect(result.hero.health).toBe(10);
});

test('heal enemy', () => {
  const testState = {
    ...baseState,
    enemyList: [{
      ...baseState.enemyList[0],
      health: 10,
    }],
  };

  const effect: ITargetedAmountEffect = {
    amount: 80,
    effectType: EffectType.HEAL_TARGET,
    targetId: baseState.enemyList[0].id,
  };

  const result = EffectService.activate(testState, effect);
  expect(result.enemyList[0].health).toBe(90);
});

test('heal hero', () => {
  const testState = {
    ...baseState,
    hero: {
      ...baseState.hero,
      health: 10,
    },
  };

  const effect: ITargetedAmountEffect = {
    amount: 80,
    effectType: EffectType.HEAL_TARGET,
    targetId: baseState.hero.id,
  };

  const result = EffectService.activate(testState, effect);
  expect(result.hero.health).toBe(90);
});

test('over heal hero', () => {
  const testState = {
    ...baseState,
    hero: {
      ...baseState.hero,
      health: 10,
    },
  };

  const effect: ITargetedAmountEffect = {
    amount: 100,
    effectType: EffectType.HEAL_TARGET,
    targetId: baseState.hero.id,
  };

  const result = EffectService.activate(testState, effect);
  expect(result.hero.health).toBe(100);
});
