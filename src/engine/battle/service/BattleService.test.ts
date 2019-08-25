import IBattleState from '../IBattleState';
import {CardType, ITargetedCard, IUnTargetedCard} from '../ICard';
import {CharacterType} from '../ICharacter';
import {EffectType, ITargetedAmountEffect, IUnTargetedEffect} from '../IEffect';
import {BattleService} from './BattleService';
import BattleStateBuilder from './BattleStateBuilder';

const baseState: IBattleState = BattleStateBuilder.initial()
  .withMana(5, 5)
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .withEnemy({characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100})
  .build();

const HERO = baseState.hero;
const ENEMY = baseState.enemyList[0];

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

test('play 1 un-targeted card', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const state: IBattleState = {
    ...baseState,
    hand: [card],
  };
  const {hand, discardPile, mana} = BattleService.playUnTargetedCard(state, state.hand[0] as IUnTargetedCard);
  expect(mana).toBe(4);
  expect(hand.length).toBe(0);
  expect(discardPile.length).toBe(1);
});

test('play 1 targeted card', () => {
  const card: ITargetedCard = {cardType: CardType.TARGETED, name: 'card', cost: 1, effectList: []};
  const state: IBattleState = {
    ...baseState,
    hand: [card],
  };
  const {hand, discardPile, mana} = BattleService.playTargetedCard(state, state.hand[0] as ITargetedCard, baseState.characterMap[ENEMY]);
  expect(mana).toBe(4);
  expect(hand.length).toBe(0);
  expect(discardPile.length).toBe(1);
});

test('cannot play card when not enough mana', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 2, effectList: []};
  const state: IBattleState = {
    ...baseState,
    hand: [card],
    mana: 1,
  };
  const {hand, discardPile, mana} = BattleService.playUnTargetedCard(state, state.hand[0] as IUnTargetedCard);
  expect(mana).toBe(1);
  expect(hand.length).toBe(1);
  expect(discardPile.length).toBe(0);
});

test('activate 1 effect', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.UN_TARGETED};
  let state: IBattleState = {
    ...baseState,
    effectQueue: [effect],
  };
  state = BattleService.activateNextEffect(state);
  expect(state.effectQueue.length).toBe(0);
  expect(state.activeEffect).toBe(effect);
  state = BattleService.completeActiveEffect(state);
  expect(state.activeEffect).toBe(undefined);
  expect(state.effectQueue.length).toBe(0);
  expect(state.effectLog.length).toBe(1);
});

test('activate damage effect', () => {
  const damageEffect: ITargetedAmountEffect = {
    amount: 5,
    effectType: EffectType.DAMAGE_TARGET,
    targetId: ENEMY,
  };

  let state: IBattleState = {
    ...baseState,
    effectQueue: [damageEffect],
  };

  state = BattleService.activateNextEffect(state);
  state = BattleService.completeActiveEffect(state);
  expect(state.characterMap[ENEMY].health).toBe(95);
});

test('activate drawing effect', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.DRAW_EFFECT};
  let state: IBattleState = {
    ...baseState,
    deck: [{cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []}],
    effectQueue: [effect],
  };
  state = BattleService.activateNextEffect(state);
  state = BattleService.completeActiveEffect(state);
  expect(state.deck.length).toBe(0);
  expect(state.hand.length).toBe(1);
});

test('has 3 effects to resolve', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.UN_TARGETED};
  let state: IBattleState = {
    ...baseState,
    effectQueue: [effect, effect, effect],
  };
  let count = 0;
  while (BattleService.hasEffectToResolve(state)) {
    state = BattleService.activateNextEffect(state);
    state = BattleService.completeActiveEffect(state);
    count++;
  }
  expect(count).toBe(3);
  expect(state.effectQueue.length).toBe(0);
});
