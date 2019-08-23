import {BattleService} from './BattleService';
import IBattleState from './IBattleState';
import {CardType, IUnTargetedCard} from './ICard';
import {CharacterType} from './ICharacter';
import {EffectType, ITargetedAmountEffect, IUnTargetedEffect} from './IEffect';

const baseState: IBattleState = {
  deck: [],
  discardPile: [],
  effectLog: [],
  effectQueue: [],
  enemyList: [{characterType: CharacterType.ENEMY, health: 100, maxHealth: 100}],
  hand: [],
  hero: {characterType: CharacterType.HERO, health: 100, maxHealth: 100},
};

test('draw 1 card', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const state: IBattleState = {
    ...baseState,
    deck: [card],
  };
  const newState = BattleService.draw(state);
  expect(newState.hand.length).toBe(1);
  expect(newState.deck.length).toBe(0);
});

test('play 1 card', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const state: IBattleState = {
    ...baseState,
    hand: [card],
  };
  const newState = BattleService.playUnTargetedCard(state, state.hand[0] as IUnTargetedCard);
  expect(newState.hand.length).toBe(0);
  expect(newState.discardPile.length).toBe(1);
});

test('activate 1 effect', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.UN_TARGETED};
  const state: IBattleState = {
    ...baseState,
    effectQueue: [effect],
  };
  const newState = BattleService.resolveNextEffect(state);
  expect(newState.effectQueue.length).toBe(0);
  expect(newState.effectLog.length).toBe(1);
});

test('activate damage effect', () => {
  const damageEffect: ITargetedAmountEffect = {
    amount: 5,
    effectType: EffectType.DAMAGE_TARGET,
    target: baseState.enemyList[0],
  };

  const state: IBattleState = {
    ...baseState,
    effectQueue: [damageEffect],
  };

  const newState = BattleService.resolveNextEffect(state);
  expect(newState.enemyList[0].health).toBe(95);
});

test('activate drawing effect', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.DRAW_EFFECT};
  const state: IBattleState = {
    ...baseState,
    deck: [{cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []}],
    effectQueue: [effect],
  };
  const newState = BattleService.resolveNextEffect(state);
  expect(newState.deck.length).toBe(0);
  expect(newState.hand.length).toBe(1);
});

test('has 3 effects to resolve', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.UN_TARGETED};
  let state: IBattleState = {
    ...baseState,
    effectQueue: [effect, effect, effect],
  };
  let count = 0;
  while (BattleService.hasEffectToResolve(state)) {
    state = BattleService.resolveNextEffect(state);
    count++;
  }
  expect(count).toBe(3);
  expect(state.effectQueue.length).toBe(0);
});
