import EffectService from './EffectService';
import IBattle, {Phase} from './IBattle';
import {CardType, ICard} from './ICard';
import {EffectType, IEffect, IUnTargetedEffect} from './IEffect';

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
    // TODO actually shuffle the deck here
    const deck = [...battle.deck, ...battle.discardPile];
    const discardPile = [];
    return {
      ...battle,
      deck,
      discardPile,
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

  public static endTurn(battle: IBattle): IBattle {
    if (battle.phase !== Phase.PLAYER_ACTION) { return battle; }
    const discardPile = [...battle.discardPile, ...battle.hand];
    const hand = [];
    battle = {
      ...battle,
      discardPile,
      hand,
    };
    return this.advanceNonPlayerPhase(battle);
  }

  public static advanceNonPlayerPhase(battle: IBattle): IBattle {
    switch (battle.phase) {
      case Phase.UPKEEP:
        return this.selectEnemyAction(battle);
      case Phase.ENEMY_CHOOSE_ACTION:
        return this.doDrawStep(battle);
      case Phase.DRAW:
        return this.beginPlayerAction(battle);
      case Phase.PLAYER_ACTION:
        return this.queueEnemyActions(battle);
      case Phase.ENEMY_ACTION:
        return this.doUpkeep(battle);
      default:
        return battle;
    }
  }

  private static doUpkeep(battle: IBattle): IBattle {
    const phase = Phase.UPKEEP;
    // TODO stuff like, tick buffs and expire any that have timed out
    const mana = battle.maxMana; // TODO possibly factor in any buffs/de-buffs for this
    const turn = battle.turn + 1;
    battle = {
      ...battle,
      mana,
      phase,
      turn,
    };
    return this.shuffle(battle);
  }

  private static selectEnemyAction(battle: IBattle): IBattle {
    const phase = Phase.ENEMY_CHOOSE_ACTION;
    return {
      ...battle,
      phase,
    };
  }

  private static doDrawStep(battle: IBattle): IBattle {
    const phase = Phase.DRAW;
    const drawCard: IUnTargetedEffect = {effectType: EffectType.DRAW_EFFECT};
    const effectQueue = [drawCard, drawCard, drawCard, drawCard, drawCard].filter((e, i) => i < battle.deck.length);
    return {
      ...battle,
      effectQueue,
      phase,
    };
  }

  private static queueEnemyActions(battle: IBattle): IBattle {
    const phase = Phase.ENEMY_ACTION;
    // TODO also place enemy actions onto the event queue now
    const effectQueue = [...battle.effectQueue];
    return {
      ...battle,
      effectQueue,
      phase,
    };
  }

  private static beginPlayerAction(battle: IBattle): IBattle {
    const phase = Phase.PLAYER_ACTION;
    return {
      ...battle,
      phase,
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
