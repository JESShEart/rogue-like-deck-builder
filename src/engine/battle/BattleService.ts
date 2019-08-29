import EffectService from './EffectService';
import IBattle from './IBattle';
import {ICard, ITargetedCard, IUnTargetedCard} from './ICard';
import {IdentifiedCharacter} from './ICharacter';
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

  public static playUnTargetedCard(battle: IBattle, card: IUnTargetedCard): IBattle {
    return this.playCardCommonBehavior(battle, card, card.effectList);
  }

  public static playTargetedCard(battle: IBattle, card: ITargetedCard, target: IdentifiedCharacter): IBattle {
    const targetId = target.id;
    const effectToQueueList = card.effectList.map((effect) => ({...effect, targetId}));
    return this.playCardCommonBehavior(battle, card, effectToQueueList);
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

  private static playCardCommonBehavior(battle: IBattle, card: ICard, effectToQueueList: IEffect[]) {
    if (battle.mana < card.cost) {
      // TODO fire an event to show a 'not enough mana' message
      return battle;
    }

    const effectQueue = [...battle.effectQueue, ...effectToQueueList];
    const hand = battle.hand.filter((c: ICard) => c !== card);
    const discardPile = [...battle.discardPile, card];
    const mana = battle.mana - card.cost;
    return {
      ...battle,
      discardPile,
      effectQueue,
      hand,
      mana,
    };
  }
}
