import Character from '../character';
import IBattleState from './BattleState';
import {Card, ITargetedCard, IUnTargetedCard} from './ICard';

export class BattleService {
  public static draw(battleState: IBattleState, quantity: number = 1): IBattleState {
    // TODO check and handle for edge cases, like not enough cards to draw, hand too large, whatever...
    const drawn = battleState.deck.slice(0, quantity);
    const deck = battleState.deck.slice(quantity, battleState.deck.length);
    const hand = [...drawn, ...battleState.hand];
    return {
      ...battleState,
      deck,
      hand,
    };
  }

  public static shuffle(battleState: IBattleState): IBattleState {
    const deck = [...battleState.deck, ...battleState.discardPile];
    // TODO shuffle the deck here
    return {
      ...battleState,
      deck,
    };
  }

  public static playUnTargetedCard(battleState: IBattleState, card: IUnTargetedCard): IBattleState {
    const effectToQueueList = card.effectList.map((effect) => ({effect}));
    const effectQueue = [...battleState.effectQueue, ...effectToQueueList];
    const hand = battleState.hand.filter((c: Card) => c !== card);
    const discardPile = [...battleState.discardPile, card];
    return {
      ...battleState,
      discardPile,
      effectQueue,
      hand,
    };
  }

  public static playTargetedCard(battleState: IBattleState, card: ITargetedCard, target: Character): IBattleState {
    const effectToQueueList = card.effectList.map((effect) =>
      ('TARGETED' in effect) ? {effect, target} : {effect});
    const effectQueue = [...battleState.effectQueue, ...effectToQueueList];
    const hand = battleState.hand.filter((c: Card) => c !== card);
    const discardPile = [...battleState.discardPile, card];
    return {
      ...battleState,
      discardPile,
      effectQueue,
      hand,
    };
  }

  public static resolveNextEffect(battleState: IBattleState): IBattleState {
    if (battleState.effectQueue.length === 0) { return battleState; }

    const currentEffect = battleState.effectQueue[0];
    const effectQueue = battleState.effectQueue.length > 1 ? battleState.effectQueue.slice(1) : [];
    const effectLog = [...battleState.effectLog, currentEffect];

    const newBattleState = {
      ...battleState,
      effectLog,
      effectQueue,
    };

    if ('target' in currentEffect) {
      return currentEffect.effect.activate(newBattleState, currentEffect.target);
    } else {
      return currentEffect.effect.activate(newBattleState);
    }
  }

  public static hasEffectToResolve(battleState: IBattleState): boolean {
    return battleState.effectQueue.length > 0;
  }
}
