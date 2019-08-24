import IBattleState from '../IBattleState';
import {ICard, ITargetedCard, IUnTargetedCard} from '../ICard';
import {IdentifiedCharacter} from '../ICharacter';
import EffectService from './EffectService';

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
    const effectQueue = [...battleState.effectQueue, ...card.effectList];
    const hand = battleState.hand.filter((c: ICard) => c !== card);
    const discardPile = [...battleState.discardPile, card];
    return {
      ...battleState,
      discardPile,
      effectQueue,
      hand,
    };
  }

  public static playTargetedCard(battleState: IBattleState, card: ITargetedCard, target: IdentifiedCharacter): IBattleState {
    const effectToQueueList = card.effectList.map((effect) =>
      ('target' in effect) ? {...effect, target} : effect);
    const effectQueue = [...battleState.effectQueue, ...effectToQueueList];
    const hand = battleState.hand.filter((c: ICard) => c !== card);
    const discardPile = [...battleState.discardPile, card];
    return {
      ...battleState,
      discardPile,
      effectQueue,
      hand,
    };
  }

  public static resolveNextEffect(battleState: IBattleState): IBattleState {
    if (!BattleService.hasEffectToResolve(battleState)) { return battleState; }

    const effect = battleState.effectQueue[0];
    const effectQueue = battleState.effectQueue.length > 1 ? battleState.effectQueue.slice(1) : [];

    const beforeActivation = {
      ...battleState,
      effectQueue,
    };

    const afterActivation =
      EffectService.activate(beforeActivation, effect);

    const effectLog = [...battleState.effectLog, effect];
    return {
      ...afterActivation,
      effectLog,
    };
  }

  public static hasEffectToResolve(battleState: IBattleState): boolean {
    return battleState.effectQueue.length > 0;
  }
}
