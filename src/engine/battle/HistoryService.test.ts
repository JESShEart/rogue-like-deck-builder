import BattleStateBuilder from './BattleStateBuilder';
import HistoryService from './HistoryService';
import IBattleState from './IBattleState';
import {CharacterType} from './ICharacter';
import IHistory from './IHistory';

const baseState1: IBattleState = BattleStateBuilder.initial()
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .build();
const baseState2: IBattleState = {...baseState1, mana: 1};
const baseState3: IBattleState = {...baseState1, mana: 2};
const baseState4: IBattleState = {...baseState1, mana: 3};

const baseHistory: IHistory = {
  index: -1,
  keep: true,
  timeTraveling: false,
  timeline: [],
};

test('push, keep false overwrites last', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3);
  result = HistoryService.push(result, baseState4);

  expect(result.index).toBe(1);
  expect(result.keep).toBe(false);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(2);
  expect(result.timeline[0]).toBe(baseState1);
  expect(result.timeline[1]).toBe(baseState4);
});

test('push', () => {
  const result = HistoryService.push(baseHistory, baseState1, true);
  expect(result.index).toBe(0);
  expect(result.keep).toBe(true);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[0]).toBe(baseState1);
});

test('push multiple', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3, true);
  expect(result.index).toBe(2);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(3);
});

test('go back', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.goBack(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(2);
  expect(result.timeline[result.index]).toBe(baseState1);
});

test('go back at beginning', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3, true);
  result = HistoryService.goBack(result);
  result = HistoryService.goBack(result);
  result = HistoryService.goBack(result);
  result = HistoryService.goBack(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(3);
});

test('go back no history', () => {
  const result = HistoryService.goBack(baseHistory);
  expect(result.index).toBe(-1);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(0);
});

test('go forward', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3, true);
  result = HistoryService.goBack(result); // baseState3 => baseState2
  result = HistoryService.goBack(result); // baseState2 => baseState1
  result = HistoryService.goForward(result); // baseState1 => baseState2
  expect(result.index).toBe(1);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(3);
  expect(result.timeline[result.index]).toBe(baseState2);
});

test('go forward at end', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.goForward(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(1);
});

test('go forward no history', () => {
  const result = HistoryService.goForward(baseHistory);
  expect(result.index).toBe(-1);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(0);
});

test('resume', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3, true);
  result = HistoryService.goBack(result); // baseState3 => baseState2
  result = HistoryService.goBack(result); // baseState2 => baseState1
  result = HistoryService.goForward(result); // baseState1 => baseState2
  result = HistoryService.resume(result);
  expect(result.index).toBe(1);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(2);
  expect(result.timeline[result.index]).toBe(baseState2);
});

test('resume at beginning', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3, true);
  result = HistoryService.goBack(result); // baseState3 => baseState2
  result = HistoryService.goBack(result); // baseState2 => baseState1
  result = HistoryService.resume(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[result.index]).toBe(baseState1);
});

test('resume at end', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3, true);
  result = HistoryService.resume(result);
  expect(result.index).toBe(2);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(3);
  expect(result.timeline[result.index]).toBe(baseState3);
});

test('resume no history', () => {
  const result = HistoryService.resume(baseHistory);
  expect(result.index).toBe(-1);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(0);
});

test('reset', () => {
  let result = HistoryService.push(baseHistory, baseState1, true);
  result = HistoryService.push(result, baseState2, true);
  result = HistoryService.push(result, baseState3, true);
  result = HistoryService.reset(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[result.index]).toBe(baseState1);
});

test('reset at beginning', () => {
  const result = HistoryService.push(baseHistory, baseState1, true);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[result.index]).toBe(baseState1);
});

test('reset no history', () => {
  const result = HistoryService.reset(baseHistory);
  expect(result.index).toBe(-1);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(0);
});
