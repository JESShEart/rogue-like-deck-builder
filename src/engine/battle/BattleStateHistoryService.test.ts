import BattleStateBuilder from './BattleStateBuilder';
import BattleStateHistoryService from './BattleStateHistoryService';
import IBattleState from './IBattleState';
import {CharacterType} from './ICharacter';
import {InitialHistory} from './IHistory';

const baseState1: IBattleState = BattleStateBuilder.initial()
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .build();
const baseState2: IBattleState = {...baseState1, mana: 1};

const baseBattleHistory = {
  battleState: baseState1,
  history: new InitialHistory(baseState1),
};

test('push', () => {
  const result = BattleStateHistoryService.push(baseBattleHistory, baseState2, true);
  expect(result.history.keep).toBe(true);
  expect(result.history.timeline.length).toBe(2);
  expect(result.battleState).toBe(baseState2);
});

test('go back', () => {
  let result = BattleStateHistoryService.push(baseBattleHistory, baseState2, true);
  result = BattleStateHistoryService.goBack(result);
  expect(result.history.timeline.length).toBe(2);
  expect(result.history.timeTraveling).toBe(true);
  expect(result.battleState).toBe(baseState1);
});

test('go forward', () => {
  let result = BattleStateHistoryService.push(baseBattleHistory, baseState2, true);
  result = BattleStateHistoryService.goBack(result);
  result = BattleStateHistoryService.goForward(result);
  expect(result.history.timeline.length).toBe(2);
  expect(result.history.timeTraveling).toBe(true);
  expect(result.battleState).toBe(baseState2);
});

test('reset', () => {
  let result = BattleStateHistoryService.push(baseBattleHistory, baseState2, true);
  result = BattleStateHistoryService.reset(result);
  expect(result.history.timeline.length).toBe(1);
  expect(result.battleState).toBe(baseState1);
});

test('resume', () => {
  let result = BattleStateHistoryService.push(baseBattleHistory, baseState2, true);
  result = BattleStateHistoryService.goBack(result);
  result = BattleStateHistoryService.resume(result);
  expect(result.history.timeline.length).toBe(1);
  expect(result.history.timeTraveling).toBe(false);
  expect(result.battleState).toBe(baseState1);
});
