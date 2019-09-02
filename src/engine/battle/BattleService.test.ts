import BattleBuilder from './BattleBuilder';
import {BattleService} from './BattleService';
import IBattle from './IBattle';
import {CardType, ITargetedCard, IUnTargetedCard} from './ICard';
import {CharacterType} from './ICharacter';
import {EffectType, ITargetedAmountEffect, ITargetedEffect, IUnTargetedEffect} from './IEffect';

const baseBattle: IBattle = BattleBuilder.initial()
  .withMana(5, 5)
  .withHero({characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100})
  .withEnemy({characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100})
  .build();

const ENEMY = baseBattle.enemyList[0];

test('draw 1 card', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle = BattleBuilder
    .from(baseBattle)
    .putCardInDeck(card)
    .build();
  const result = BattleService.draw(battle);
  expect(result.hand.length).toBe(1);
  expect(result.deck.length).toBe(0);
});

test('play 1 un-targeted card', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle = BattleBuilder
    .from(baseBattle)
    .putCardInHand(card)
    .build();
  const {hand, discardPile, mana} = BattleService.playCard(battle, battle.hand[0]);
  expect(mana).toBe(4);
  expect(hand.length).toBe(0);
  expect(discardPile.length).toBe(1);
});

test('play 1 targeted card', () => {
  const card: ITargetedCard = {cardType: CardType.TARGETED, name: 'card', cost: 1, effectList: [{effectType: EffectType.TARGETED}]};
  const battle: IBattle = BattleBuilder
    .from(baseBattle)
    .putCardInHand(card)
    .build();
  const {hand, discardPile, mana, effectQueue} =
    BattleService.playCard(battle, battle.hand[0], ENEMY);
  expect(mana).toBe(4);
  expect(hand.length).toBe(0);
  expect(discardPile.length).toBe(1);
  expect(effectQueue.length).toBe(1);
  const queuedEffect = effectQueue[0] as ITargetedEffect;
  expect(queuedEffect.targetId).toBe(ENEMY);
});

test('cannot play card when not enough mana', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 2, effectList: []};
  const battle: IBattle = BattleBuilder.from(baseBattle)
    .putCardInHand(card)
    .withMana(1, 5)
    .build();
  const {hand, discardPile, mana} = BattleService.playCard(battle, battle.hand[0]);
  expect(mana).toBe(1);
  expect(hand.length).toBe(1);
  expect(discardPile.length).toBe(0);
});

test('activate 1 effect', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.UN_TARGETED};
  let battle: IBattle = {
    ...baseBattle,
    effectQueue: [effect],
  };
  battle = BattleService.activateNextEffect(battle);
  expect(battle.effectQueue.length).toBe(0);
  expect(battle.activeEffect).toBe(effect);
  battle = BattleService.completeActiveEffect(battle);
  expect(battle.activeEffect).toBe(undefined);
  expect(battle.effectQueue.length).toBe(0);
  expect(battle.effectLog.length).toBe(1);
});

test('activate damage effect', () => {
  const damageEffect: ITargetedAmountEffect = {
    amount: 5,
    effectType: EffectType.DAMAGE_TARGET,
    targetId: ENEMY,
  };

  let battle: IBattle = {
    ...baseBattle,
    effectQueue: [damageEffect],
  };

  battle = BattleService.activateNextEffect(battle);
  battle = BattleService.completeActiveEffect(battle);
  expect(battle.characterMap[ENEMY].health).toBe(95);
});

test('activate drawing effect', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.DRAW_EFFECT};
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  let battle: IBattle = {
    ...BattleBuilder.from(baseBattle)
      .putCardInHand(card)
      .build(),
    effectQueue: [effect],
  };
  battle = BattleService.activateNextEffect(battle);
  battle = BattleService.completeActiveEffect(battle);
  expect(battle.deck.length).toBe(0);
  expect(battle.hand.length).toBe(1);
});

test('has 3 effects to resolve', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.UN_TARGETED};
  let battle: IBattle = {
    ...baseBattle,
    effectQueue: [effect, effect, effect],
  };

  battle = BattleService.activateNextEffect(battle);
  battle = BattleService.completeActiveEffect(battle);
  expect(battle.effectQueue.length).toBe(2);

  battle = BattleService.activateNextEffect(battle);
  battle = BattleService.completeActiveEffect(battle);
  expect(battle.effectQueue.length).toBe(1);

  battle = BattleService.activateNextEffect(battle);
  battle = BattleService.completeActiveEffect(battle);
  expect(battle.effectQueue.length).toBe(0);
});
