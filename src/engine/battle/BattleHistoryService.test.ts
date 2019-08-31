import BattleBuilder from './BattleBuilder';
import BattleHistoryService from './BattleHistoryService';
import HistoryService from './HistoryService';
import IBattle, {Phase} from './IBattle';
import IBattleHistory from './IBattleHistory';
import {CardType, ITargetedCard} from './ICard';
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

const fiveDamageCard: ITargetedCard = {
  cardType: CardType.TARGETED,
  cost: 1,
  effectList: [fiveDamageToHero],
  name: 'Deal 5 damage',
};

test('time travel', () => {
  const result = BattleHistoryService.timeTravel(baseBattleHistory);
  expect(result.history.timeTraveling).toBe(true);
});

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

test('play card', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: {
      ...baseBattleHistory.battle,
      hand: [fiveDamageCard],
      phase: Phase.PLAYER_ACTION,
    },
  };
  const result = BattleHistoryService.playCard(testBattle, fiveDamageCard, testBattle.battle.hero);
  expect(result.battle.activeEffect).toBeTruthy();
  expect(result.battle.hand.length).toBe(0);
  expect(result.battle.discardPile.length).toBe(1);
  expect(result.history.timeline.length).toBe(3);
});

test('playing card ends time traveling', () => {
  let testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: {
      ...baseBattleHistory.battle,
      hand: [fiveDamageCard],
      phase: Phase.PLAYER_ACTION,
    },
  };
  testBattle = BattleHistoryService.timeTravel(testBattle);
  const result = BattleHistoryService.playCard(testBattle, fiveDamageCard, testBattle.battle.hero);
  expect(result.battle.activeEffect).toBeTruthy();
  expect(result.battle.hand.length).toBe(0);
  expect(result.battle.discardPile.length).toBe(1);
  expect(result.history.timeline.length).toBe(3);
  expect(result.history.timeTraveling).toBe(false);
});

test('playing card fast forwards effect queue', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: {
      ...baseBattleHistory.battle,
      effectQueue: [fiveDamageToHero, fiveDamageToHero],
      hand: [fiveDamageCard],
      phase: Phase.PLAYER_ACTION,
    },
  };
  const result = BattleHistoryService.playCard(testBattle, fiveDamageCard, testBattle.battle.hero);
  expect(result.battle.characterMap[result.battle.hero].health).toBe(85);
});

test('play card fails when not player turn', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: {
      ...baseBattleHistory.battle,
      hand: [fiveDamageCard],
      phase: Phase.ENEMY_ACTION,
    },
  };
  const result = BattleHistoryService.playCard(testBattle, fiveDamageCard, testBattle.battle.hero);
  expect(result).toStrictEqual(testBattle);
});

test('play card fails when not enough mana', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: {
      ...baseBattleHistory.battle,
      hand: [fiveDamageCard],
      mana: 0,
    },
  };
  const result = BattleHistoryService.playCard(testBattle, fiveDamageCard, testBattle.battle.hero);
  expect(result).toStrictEqual(testBattle);
});
