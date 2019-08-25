import IBattleState from '../IBattleState';
import {CharacterType} from '../ICharacter';
import {EffectType} from '../IEffect';
import BattleStateBuilder from './BattleStateBuilder';
import EffectService from './EffectService';

const baseState: IBattleState = BattleStateBuilder.initial()
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .withEnemy({characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100})
  .build();

const HERO = baseState.hero;
const ENEMY = baseState.enemyList[0];

test('damage enemy', () => {
  const testState = {
    ...baseState,
    activeEffect: {
      amount: 90,
      effectType: EffectType.DAMAGE_TARGET,
      targetId: ENEMY,
    },
  };
  const result = EffectService.activate(testState);
  expect(result.characterMap[ENEMY].health).toBe(10);
});

test('damage hero', () => {
  const testState = {
    ...baseState,
    activeEffect: {
      amount: 90,
      effectType: EffectType.DAMAGE_TARGET,
      targetId: HERO,
    },
  };

  const result = EffectService.activate(testState);
  expect(result.characterMap[HERO].health).toBe(10);
});

test('heal enemy', () => {
  const testState = {
    ...baseState,
    activeEffect: {
      amount: 80,
      effectType: EffectType.HEAL_TARGET,
      targetId: ENEMY,
    },
    characterMap: {
      ...baseState.characterMap,
      [ENEMY]: {...baseState.characterMap[ENEMY], health: 10},
    },
  };

  const result = EffectService.activate(testState);
  expect(result.characterMap[result.enemyList[0]].health).toBe(90);
});

test('heal hero', () => {
  const testState = {
    ...baseState,
    activeEffect: {
      amount: 80,
      effectType: EffectType.HEAL_TARGET,
      targetId: HERO,
    },
    characterMap: {
      ...baseState.characterMap,
      [HERO]: {...baseState.characterMap[HERO], health: 10},
    },
  };

  const result = EffectService.activate(testState);
  expect(result.characterMap[HERO].health).toBe(90);
});

test('over heal hero', () => {
  const testState = {
    ...baseState,
    activeEffect: {
      amount: 100,
      effectType: EffectType.HEAL_TARGET,
      targetId: HERO,
    },
    characterMap: {
      ...baseState.characterMap,
      [HERO]: {...baseState.characterMap[HERO], health: 10},
    },
  };

  const result = EffectService.activate(testState);
  expect(result.characterMap[HERO].health).toBe(100);
});
