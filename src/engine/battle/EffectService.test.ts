import BattleBuilder from './BattleBuilder';
import EffectService from './EffectService';
import IBattle from './IBattle';
import {CharacterType} from './ICharacter';
import {EffectType} from './IEffect';

const baseBattle: IBattle = BattleBuilder.initial()
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .withEnemy({characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100})
  .build();

const HERO = baseBattle.hero;
const ENEMY = baseBattle.enemyList[0];

test('damage enemy', () => {
  const testBattle = {
    ...baseBattle,
    activeEffect: {
      amount: 90,
      effectType: EffectType.DAMAGE_TARGET,
      targetId: ENEMY,
    },
  };
  const result = EffectService.activate(testBattle);
  expect(result.characterMap[ENEMY].health).toBe(10);
});

test('damage hero', () => {
  const testBattle = {
    ...baseBattle,
    activeEffect: {
      amount: 90,
      effectType: EffectType.DAMAGE_TARGET,
      targetId: HERO,
    },
  };

  const result = EffectService.activate(testBattle);
  expect(result.characterMap[HERO].health).toBe(10);
});

test('heal enemy', () => {
  const testBattle = {
    ...baseBattle,
    activeEffect: {
      amount: 80,
      effectType: EffectType.HEAL_TARGET,
      targetId: ENEMY,
    },
    characterMap: {
      ...baseBattle.characterMap,
      [ENEMY]: {...baseBattle.characterMap[ENEMY], health: 10},
    },
  };

  const result = EffectService.activate(testBattle);
  expect(result.characterMap[result.enemyList[0]].health).toBe(90);
});

test('heal hero', () => {
  const testBattle = {
    ...baseBattle,
    activeEffect: {
      amount: 80,
      effectType: EffectType.HEAL_TARGET,
      targetId: HERO,
    },
    characterMap: {
      ...baseBattle.characterMap,
      [HERO]: {...baseBattle.characterMap[HERO], health: 10},
    },
  };

  const result = EffectService.activate(testBattle);
  expect(result.characterMap[HERO].health).toBe(90);
});

test('over heal hero', () => {
  const testBattle = {
    ...baseBattle,
    activeEffect: {
      amount: 100,
      effectType: EffectType.HEAL_TARGET,
      targetId: HERO,
    },
    characterMap: {
      ...baseBattle.characterMap,
      [HERO]: {...baseBattle.characterMap[HERO], health: 10},
    },
  };

  const result = EffectService.activate(testBattle);
  expect(result.characterMap[HERO].health).toBe(100);
});
