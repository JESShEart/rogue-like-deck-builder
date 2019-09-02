import EffectService from './EffectService';
import IBattle from './IBattle';
import {CardType, ICard} from './ICard';
import {IEffect} from './IEffect';

export class BattleService {

  public static draw(battle: IBattle, quantity: number = 1): IBattle {
    // TODO check and handle for edge cases, like not enough cards to draw, hand too large, whatever...
    const drawn = battle.deck.slice(0, quantity);
    const deck = battle.deck.slice(quantity, battle.deck.length);
    const hand = [...drawn, ...battle.hand];
    return {
      ...battle,
      deck,
      hand,
    };
  }

  public static shuffle(battle: IBattle): IBattle {
    const deck = [...battle.deck, ...battle.discardPile];
    // TODO shuffle the deck here
    return {
      ...battle,
      deck,
    };
  }

  public static playCard(battle: IBattle, cardId: number, targetId?: number): IBattle {
    const card = battle.cardMap[cardId];
    if (battle.mana < card.cost) {
      // TODO fire an event to show a 'not enough mana' message
      return battle;
    }
    const effectToQueueList = BattleService.prepCardEffects(card, targetId);
    const effectQueue = [...battle.effectQueue, ...effectToQueueList];
    const hand = battle.hand.filter((id) => id !== cardId);
    const discardPile = [...battle.discardPile, cardId];
    const mana = battle.mana - card.cost;
    return {
      ...battle,
      discardPile,
      effectQueue,
      hand,
      mana,
    };
  }

  public static activateNextEffect(battle: IBattle): IBattle {
    const activeEffect = battle.effectQueue[0];
    const effectQueue = battle.effectQueue.length > 1 ? battle.effectQueue.slice(1) : [];
    const effectActive = {
      ...battle,
      activeEffect,
      effectQueue,
    };
    return EffectService.activate(effectActive);
  }

  public static completeActiveEffect(battle: IBattle): IBattle {
    if (!battle.activeEffect) { return battle; }
    const effectLog = [...battle.effectLog, battle.activeEffect];
    const activeEffect = undefined;
    return {
      ...battle,
      activeEffect,
      effectLog,
    };
  }

  private static prepCardEffects(card: ICard, targetId?: number): IEffect[] {
    if (card.cardType === CardType.TARGETED) {
      return card.effectList.map((effect) => ({...effect, targetId}));
    } else {
      return card.effectList;
    }
  }
}
