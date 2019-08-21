import card from '../card';
import Character from '../character';
import {BattleService} from './BattleService';
import IBattleState from './BattleState';
import TargetedCard from './TargetedCard';
import TargetedEffect from './TargetedEffect';
import UnTargetedCard from './UnTargetedCard';
import UnTargetedEffect from './UnTargetedEffect';

const baseState: IBattleState = {
  deck: [],
  discardPile: [],
  effectLog: [],
  effectQueue: [],
  enemyList: [new Character(100)],
  hand: [],
  hero: new Character(100),
};

test('draw 1 card', () => {
  const state: IBattleState = {
    ...baseState,
    deck: [new UnTargetedCard('card', [])],
  };
  const newState = BattleService.draw(state);
  expect(newState.hand.length).toBe(1);
  expect(newState.deck.length).toBe(0);
});

test('play 1 card', () => {
  const state: IBattleState = {
    ...baseState,
    hand: [new UnTargetedCard('card', [])],
  };
  const newState = BattleService.playUnTargetedCard(state, state.hand[0] as UnTargetedCard);
  expect(newState.hand.length).toBe(0);
  expect(newState.discardPile.length).toBe(1);
});

test('activate 1 effect', () => {
  const effect = new UnTargetedEffect((battleState: IBattleState) => battleState);
  const state: IBattleState = {
    ...baseState,
    effectQueue: [{effect}],
  };
  const newState = BattleService.resolveNextEffect(state);
  expect(newState.effectQueue.length).toBe(0);
  expect(newState.effectLog.length).toBe(1);
});

test('activate damage effect', () => {
  const deal5DamageToTarget = (battleState: IBattleState, target: Character): IBattleState => {
    const health = target.health - 5;
    const enemyList = battleState.enemyList
      .map((enemy: Character) => target === enemy ? {...target, health} : enemy);
    return {
      ...battleState,
      enemyList,
    };
  };
  const damageEffect = new TargetedEffect(deal5DamageToTarget);

  const state: IBattleState = {
    ...baseState,
    effectQueue: [{
      effect: damageEffect,
      target: baseState.enemyList[0],
    }],
  };

  const newState = BattleService.resolveNextEffect(state);
  expect(newState.enemyList[0].health).toBe(95);
});

test('activate drawing effect', () => {
  const drawCard = (battleState: IBattleState) => BattleService.draw(battleState);
  const effect = new UnTargetedEffect(drawCard);
  const state: IBattleState = {
    ...baseState,
    deck: [new TargetedCard('card', [])],
    effectQueue: [{effect}],
  };
  const newState = BattleService.resolveNextEffect(state);
  expect(newState.deck.length).toBe(0);
  expect(newState.hand.length).toBe(1);
});

test('has 3 effects to resolve', () => {
  const effect = new UnTargetedEffect((battleState) => battleState);
  let state: IBattleState = {
    ...baseState,
    effectQueue: [{effect}, {effect}, {effect}],
  };
  let count = 0;
  while (BattleService.hasEffectToResolve(state)) {
    state = BattleService.resolveNextEffect(state);
    count++;
  }
  expect(count).toBe(3);
  expect(state.effectQueue.length).toBe(0);
});
