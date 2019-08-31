import BattleBuilder from './BattleBuilder';
import BattleHistoryService from './BattleHistoryService';
import HistoryService from './HistoryService';
import IBattle from './IBattle';
import {CharacterType, IHeroCharacter} from './ICharacter';
import {EffectType, IEffect, ITargetedAmountEffect} from './IEffect';
import {InitialHistory} from './IHistory';

const hero: IHeroCharacter = {
  characterType: CharacterType.HERO,
  health: 100,
  maxHealth: 100,
  name: 'Hero',
};

const baseBattle1: IBattle = BattleBuilder.initial()
  .withHero(hero)
  .build();
const baseBattle2: IBattle = {...baseBattle1, mana: 1};

const baseBattleHistory = {
  battle: baseBattle2,
  history: HistoryService.push(new InitialHistory(baseBattle1), baseBattle2, true),
};

const fiveDamageToHero: ITargetedAmountEffect = {
  amount: 5,
  effectType: EffectType.DAMAGE_TARGET,
  targetId: baseBattleHistory.battle.hero,
};

test('go back', () => {
  const result = BattleHistoryService.goBack(baseBattleHistory);
  expect(result.history.timeline.length).toBe(2);
  expect(result.history.timeTraveling).toBe(true);
  expect(result.battle).toBe(baseBattle1);
});

test('go forward', () => {
  let result = BattleHistoryService.goBack(baseBattleHistory);
  result = BattleHistoryService.goForward(result);
  expect(result.history.timeline.length).toBe(2);
  expect(result.history.timeTraveling).toBe(true);
  expect(result.battle).toBe(baseBattle2);
});

test('reset', () => {
  const result = BattleHistoryService.reset(baseBattleHistory);
  expect(result.history.timeline.length).toBe(1);
  expect(result.battle).toBe(baseBattle1);
});

test('resume', () => {
  let result = BattleHistoryService.goBack(baseBattleHistory);
  result = BattleHistoryService.resume(result);
  expect(result.history.timeline.length).toBe(1);
  expect(result.history.timeTraveling).toBe(false);
  expect(result.battle).toBe(baseBattle1);
});

test('run does nothing', () => {
  const result = BattleHistoryService.run(baseBattleHistory);
  expect(result).toStrictEqual(baseBattleHistory);
});

test('run queued effect', () => {
  const testBattle = {
    battle: {
      ...baseBattleHistory.battle,
      effectQueue: [fiveDamageToHero],
    },
    history: baseBattleHistory.history,
  };

  const result = BattleHistoryService.run(testBattle);
  expect(result.history.timeline.length).toBe(2);
  expect(result.battle.effectQueue.length).toBe(0);
  expect(result.battle.activeEffect).toBe(fiveDamageToHero);
  expect(result.battle.characterMap[result.battle.hero].health).toBe(95);
});

test('run active effect', () => {
  const testBattle = {
    battle: {
      ...baseBattleHistory.battle,
      activeEffect: fiveDamageToHero,
    },
    history: baseBattleHistory.history,
  };

  const result = BattleHistoryService.run(testBattle);
  expect(result.history.timeline.length).toBe(2);
  expect(result.battle.effectLog.length).toBe(1);
  expect(result.battle.activeEffect).toBeFalsy();
  expect(result.battle.characterMap[result.battle.hero].health).toBe(100);
});

test('run active effect with queued effect', () => {
  const activeEffect: IEffect = {effectType: EffectType.UN_TARGETED};
  const testBattle = {
    battle: {
      ...baseBattleHistory.battle,
      activeEffect,
      effectQueue: [fiveDamageToHero],
    },
    history: baseBattleHistory.history,
  };

  const result = BattleHistoryService.run(testBattle);
  expect(result.history.timeline.length).toBe(2);
  expect(result.battle.effectLog).toStrictEqual([activeEffect]);
  expect(result.battle.activeEffect).toBe(fiveDamageToHero);
  expect(result.battle.characterMap[result.battle.hero].health).toBe(95);
});
