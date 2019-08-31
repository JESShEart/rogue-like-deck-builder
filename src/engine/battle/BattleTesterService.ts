import IBattle, {Phase} from './IBattle';
import {ICard} from './ICard';

export default class BattleTesterService {
  public static shouldActivateNextEffect(battle: IBattle): boolean {
    if (battle.activeEffect) {return false; }
    return !!battle.effectQueue.length;
  }

  public static shouldCompleteEffect(battle: IBattle): boolean {
    if (!battle.activeEffect) { return false; }
    // TODO determine if the effect requires user feedback and reject
    return true;
  }

  public static canPlayCard(battle: IBattle): boolean {
    if (battle.activeEffect) {return false; }
    return !battle.effectQueue.length;
  }

  public static cardWillSucceed(battle: IBattle, card: ICard): boolean {
    return battle.mana >= card.cost;
  }

  public static waitingForPlayerChoice(battle: IBattle): boolean {
    if (!battle.activeEffect) { return false; }
    // TODO determine if the effect requires user feedback
    return false;
  }

  public static isPlayerTurn(battle: IBattle): boolean {
    return battle.phase === Phase.PLAYER_ACTION;
  }
}
