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
    battle: BattleBuilder.from(baseBattleHistory.battle)
      .putCardInHand(fiveDamageCard)
      .withPhase(Phase.PLAYER_ACTION)
      .build(),
  };
  const result = BattleHistoryService.playCard(testBattle, testBattle.battle.hand[0], testBattle.battle.hero);
  expect(result.battle.activeEffect).toBeTruthy();
  expect(result.battle.hand.length).toBe(0);
  expect(result.battle.discardPile.length).toBe(1);
  expect(result.history.timeline.length).toBe(3);
});

test('playing card ends time traveling', () => {
  const battle: IBattle = BattleBuilder.from(baseBattleHistory.battle)
    .putCardInHand(fiveDamageCard)
    .withPhase(Phase.PLAYER_ACTION)
    .build();
  let testBattle: IBattleHistory = {
    battle,
    history: HistoryService.push(baseBattleHistory.history, battle),
  };
  testBattle = BattleHistoryService.timeTravel(testBattle);
  const result = BattleHistoryService.playCard(testBattle, testBattle.battle.hand[0], testBattle.battle.hero);
  expect(result.battle.activeEffect).toBeTruthy();
  expect(result.battle.hand.length).toBe(0);
  expect(result.battle.discardPile.length).toBe(1);
  expect(result.history.timeline.length).toBe(3);
  expect(result.history.timeTraveling).toBe(false);
});

test('playing card fast forwards effect queue', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: BattleBuilder.from(baseBattleHistory.battle)
      .withEffectInQueue(fiveDamageToHero)
      .withEffectInQueue(fiveDamageToHero)
      .putCardInHand(fiveDamageCard)
      .withPhase(Phase.PLAYER_ACTION)
      .build(),
  };
  const result = BattleHistoryService.playCard(testBattle, testBattle.battle.hand[0], testBattle.battle.hero);
  expect(result.battle.characterMap[result.battle.hero].health).toBe(85);
});

test('play card fails when not player turn', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: BattleBuilder.from(baseBattleHistory.battle)
      .putCardInHand(fiveDamageCard)
      .withPhase(Phase.ENEMY_ACTION).build(),
  };

  const result = BattleHistoryService.playCard(testBattle, testBattle.battle.hand[0], testBattle.battle.hero);
  expect(result).toStrictEqual(testBattle);
});

test('play card fails when not enough mana', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: BattleBuilder.from(baseBattleHistory.battle)
      .putCardInHand(fiveDamageCard)
      .withMana(0, 5)
      .build(),
  };
  const result = BattleHistoryService.playCard(testBattle, testBattle.battle.hand[0], testBattle.battle.hero);
  expect(result).toStrictEqual(testBattle);
});

test('advancePhase calls run', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: BattleBuilder.from(baseBattleHistory.battle)
      // Choose Action advances to Draw phase
      .withPhase(Phase.ENEMY_CHOOSE_ACTION)
      // having a card in deck should spawn a new draw event upon starting the Draw phase
      .putCardInDeck({cardType: CardType.UN_TARGETED, cost: 0, effectList: [], name: 'test'})
      .build(),
  };
  const result = BattleHistoryService.advancePhase(testBattle);
  expect(result.battle.phase).toBe(Phase.DRAW);
  expect(result.battle.activeEffect).toBeTruthy();
});

test('end turn captures history', () => {
  const testBattle: IBattleHistory = {
    ...baseBattleHistory,
    battle: BattleBuilder.from(baseBattleHistory.battle)
      .withPhase(Phase.PLAYER_ACTION)
      .build(),
  };
  const {battle, history} = BattleHistoryService.endTurn(testBattle);
  expect(battle.phase).toBe(Phase.ENEMY_ACTION);
  expect(history.timeline.length).toBe(3);
});
