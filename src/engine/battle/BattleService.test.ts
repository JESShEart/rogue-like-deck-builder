import BattleBuilder from './BattleBuilder';
import {BattleService} from './BattleService';
import IBattle, {Phase} from './IBattle';
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

test('shuffle puts discard pile into deck', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle = BattleBuilder
    .from(baseBattle)
    .putCardInDeck(card)
    .putCardInDeck(card)
    .putCardInDiscardPile(card)
    .putCardInDiscardPile(card)
    .build();
  const {discardPile, deck} = BattleService.shuffle(battle);
  expect(discardPile.length).toBe(0);
  expect(deck.length).toBe(4);
});

test('shuffle no cards', () => {
  const battle: IBattle = BattleBuilder
    .from(baseBattle)
    .build();
  const {discardPile, deck} = BattleService.shuffle(battle);
  expect(discardPile.length).toBe(0);
  expect(deck.length).toBe(0);
});

test('shuffle discard pile with empty deck', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle = BattleBuilder
    .from(baseBattle)
    .putCardInDiscardPile(card)
    .putCardInDiscardPile(card)
    .build();
  const {discardPile, deck} = BattleService.shuffle(battle);
  expect(discardPile.length).toBe(0);
  expect(deck.length).toBe(2);
});

test('shuffle empty discard pile with deck', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle = BattleBuilder
    .from(baseBattle)
    .putCardInDeck(card)
    .putCardInDeck(card)
    .build();
  const {discardPile, deck} = BattleService.shuffle(battle);
  expect(discardPile.length).toBe(0);
  expect(deck.length).toBe(2);
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
  let battle: IBattle = BattleBuilder.from(baseBattle)
      .putCardInDeck(card)
      .withEffectInQueue(effect)
      .build();
  battle = BattleService.activateNextEffect(battle);
  battle = BattleService.completeActiveEffect(battle);
  expect(battle.deck.length).toBe(0);
  expect(battle.hand.length).toBe(1);
});

test('has 3 effects to resolve', () => {
  const effect: IUnTargetedEffect = {effectType: EffectType.UN_TARGETED};
  let battle: IBattle =  BattleBuilder.from(baseBattle)
    .withEffectInQueue(effect)
    .withEffectInQueue(effect)
    .withEffectInQueue(effect)
    .build();

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

test('End turn', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle =  BattleBuilder.from(baseBattle)
    .withPhase(Phase.PLAYER_ACTION)
    .putCardInHand(card)
    .putCardInHand(card)
    .build();
  const result = BattleService.endTurn(battle);
  expect(result.phase).toBe(Phase.ENEMY_ACTION);
  expect(result.discardPile.length).toBe(2);
});

test('Enemy Action advances to Upkeep', () => {
  const battle: IBattle =  BattleBuilder.from(baseBattle)
    .withPhase(Phase.ENEMY_ACTION)
    .build();
  const result = BattleService.advanceNonPlayerPhase(battle);
  expect(result.phase).toBe(Phase.UPKEEP);
});

test('Upkeep advances to Enemy Choose Action', () => {
  const battle: IBattle =  BattleBuilder.from(baseBattle)
    .withPhase(Phase.UPKEEP)
    .build();
  const result = BattleService.advanceNonPlayerPhase(battle);
  expect(result.phase).toBe(Phase.ENEMY_CHOOSE_ACTION);
});

test('Enemy Choose Action advances to Draw', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle =  BattleBuilder.from(baseBattle)
    .withPhase(Phase.ENEMY_CHOOSE_ACTION)
    .putCardInDeck(card)
    .putCardInDeck(card)
    .putCardInDeck(card)
    .build();
  const result = BattleService.advanceNonPlayerPhase(battle);
  expect(result.phase).toBe(Phase.DRAW);
  expect(result.effectQueue.length).toBe(3);
});

test('Draw advances to Player Action', () => {
  const battle: IBattle =  BattleBuilder.from(baseBattle)
    .withPhase(Phase.DRAW)
    .build();
  const result = BattleService.advanceNonPlayerPhase(battle);
  expect(result.phase).toBe(Phase.PLAYER_ACTION);
});

test('Player Action advances to Enemy Action', () => {
  const battle: IBattle =  BattleBuilder.from(baseBattle)
    .withPhase(Phase.PLAYER_ACTION)
    .build();
  const result = BattleService.advanceNonPlayerPhase(battle);
  expect(result.phase).toBe(Phase.ENEMY_ACTION);
});

test('Enemy Action advances to Upkeep', () => {
  const card: IUnTargetedCard = {cardType: CardType.UN_TARGETED, name: 'card', cost: 1, effectList: []};
  const battle: IBattle =  BattleBuilder.from(baseBattle)
    .withPhase(Phase.ENEMY_ACTION)
    .putCardInDiscardPile(card)
    .putCardInDiscardPile(card)
    .putCardInDeck(card)
    .putCardInDeck(card)
    .putCardInDeck(card)
    .withMana(0, 10)
    .build();
  const {phase, deck, turn, mana} = BattleService.advanceNonPlayerPhase(battle);
  expect(phase).toBe(Phase.UPKEEP);
  expect(deck.length).toBe(5);
  expect(turn).toBe(2);
  expect(mana).toBe(10);
});
