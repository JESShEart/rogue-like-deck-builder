import BattleBuilder from './BattleBuilder';
import BattleHistoryService from './BattleHistoryService';
import IBattle from './IBattle';
import {CharacterType} from './ICharacter';
import {InitialHistory} from './IHistory';

const baseBattle1: IBattle = BattleBuilder.initial()
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .build();
const baseBattle2: IBattle = {...baseBattle1, mana: 1};

const baseBattleHistory = {
  battle: baseBattle1,
  history: new InitialHistory(baseBattle1),
};

test('push', () => {
  const result = BattleHistoryService.push(baseBattleHistory, baseBattle2, true);
  expect(result.history.timeline.length).toBe(2);
  expect(result.battle).toBe(baseBattle2);
});

test('go back', () => {
  let result = BattleHistoryService.push(baseBattleHistory, baseBattle2, true);
  result = BattleHistoryService.goBack(result);
  expect(result.history.timeline.length).toBe(2);
  expect(result.history.timeTraveling).toBe(true);
  expect(result.battle).toBe(baseBattle1);
});

test('go forward', () => {
  let result = BattleHistoryService.push(baseBattleHistory, baseBattle2, true);
  result = BattleHistoryService.goBack(result);
  result = BattleHistoryService.goForward(result);
  expect(result.history.timeline.length).toBe(2);
  expect(result.history.timeTraveling).toBe(true);
  expect(result.battle).toBe(baseBattle2);
});

test('reset', () => {
  let result = BattleHistoryService.push(baseBattleHistory, baseBattle2, true);
  result = BattleHistoryService.reset(result);
  expect(result.history.timeline.length).toBe(1);
  expect(result.battle).toBe(baseBattle1);
});

test('resume', () => {
  let result = BattleHistoryService.push(baseBattleHistory, baseBattle2, true);
  result = BattleHistoryService.goBack(result);
  result = BattleHistoryService.resume(result);
  expect(result.history.timeline.length).toBe(1);
  expect(result.history.timeTraveling).toBe(false);
  expect(result.battle).toBe(baseBattle1);
});
