import BattleBuilder from './BattleBuilder';
import HistoryService from './HistoryService';
import IBattle from './IBattle';
import {CharacterType} from './ICharacter';
import IHistory from './IHistory';

const baseBattle1: IBattle = BattleBuilder.initial()
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .build();
const baseBattle2: IBattle = {...baseBattle1, mana: 1};
const baseBattle3: IBattle = {...baseBattle1, mana: 2};
const baseBattle4: IBattle = {...baseBattle1, mana: 3};

const baseHistory: IHistory = {
  index: -1,
  timeTraveling: false,
  timeline: [],
};

test('push, keep false overwrites last', () => {
  let result = HistoryService.push(baseHistory, baseBattle1);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3);
  result = HistoryService.push(result, baseBattle4);

  expect(result.index).toBe(1);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(2);
  expect(result.timeline[0]).toBe(baseBattle1);
  expect(result.timeline[1]).toBe(baseBattle4);
});

test('push', () => {
  const result = HistoryService.push(baseHistory, baseBattle1, true);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[0]).toBe(baseBattle1);
});

test('push multiple', () => {
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3, true);
  expect(result.index).toBe(2);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(3);
});

test('go back', () => {
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.goBack(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(2);
  expect(result.timeline[result.index]).toBe(baseBattle1);
});

test('go back at beginning', () => {
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3, true);
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
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3, true);
  result = HistoryService.goBack(result); // baseBattle3 => baseBattle2
  result = HistoryService.goBack(result); // baseBattle2 => baseBattle1
  result = HistoryService.goForward(result); // baseBattle1 => baseBattle2
  expect(result.index).toBe(1);
  expect(result.timeTraveling).toBe(true);
  expect(result.timeline.length).toBe(3);
  expect(result.timeline[result.index]).toBe(baseBattle2);
});

test('go forward at end', () => {
  let result = HistoryService.push(baseHistory, baseBattle1, true);
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
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3, true);
  result = HistoryService.goBack(result); // baseBattle3 => baseBattle2
  result = HistoryService.goBack(result); // baseBattle2 => baseBattle1
  result = HistoryService.goForward(result); // baseBattle1 => baseBattle2
  result = HistoryService.resume(result);
  expect(result.index).toBe(1);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(2);
  expect(result.timeline[result.index]).toBe(baseBattle2);
});

test('resume at beginning', () => {
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3, true);
  result = HistoryService.goBack(result); // baseBattle3 => baseBattle2
  result = HistoryService.goBack(result); // baseBattle2 => baseBattle1
  result = HistoryService.resume(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[result.index]).toBe(baseBattle1);
});

test('resume at end', () => {
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3, true);
  result = HistoryService.resume(result);
  expect(result.index).toBe(2);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(3);
  expect(result.timeline[result.index]).toBe(baseBattle3);
});

test('resume no history', () => {
  const result = HistoryService.resume(baseHistory);
  expect(result.index).toBe(-1);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(0);
});

test('reset', () => {
  let result = HistoryService.push(baseHistory, baseBattle1, true);
  result = HistoryService.push(result, baseBattle2, true);
  result = HistoryService.push(result, baseBattle3, true);
  result = HistoryService.reset(result);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[result.index]).toBe(baseBattle1);
});

test('reset at beginning', () => {
  const result = HistoryService.push(baseHistory, baseBattle1, true);
  expect(result.index).toBe(0);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(1);
  expect(result.timeline[result.index]).toBe(baseBattle1);
});

test('reset no history', () => {
  const result = HistoryService.reset(baseHistory);
  expect(result.index).toBe(-1);
  expect(result.timeTraveling).toBe(false);
  expect(result.timeline.length).toBe(0);
});

test('set timetraveling', () => {
  const result = HistoryService.timeTravel(baseHistory);
  expect(result.timeTraveling).toBe(true);
});
