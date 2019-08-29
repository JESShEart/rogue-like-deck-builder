import IBattleState from './IBattleState';
import {ICard} from './ICard';

export default class BattleTesterService {
  public static shouldActivateNextEffect(battleState: IBattleState): boolean {
    if (battleState.activeEffect) {return false; }
    return !!battleState.effectQueue.length;
  }

  public static shouldCompleteEffect(battleState: IBattleState): boolean {
    if (!battleState.activeEffect) { return false; }
    // TODO determine if the effect requires user feedback and reject
    return true;
  }

  public static canPlayCard(battleState: IBattleState): boolean {
    if (battleState.activeEffect) {return false; }
    return !battleState.effectQueue.length;
  }

  public static cardWillSucceed(battleState: IBattleState, card: ICard): boolean {
    return battleState.mana >= card.cost;
  }

  public static waitingForPlayerChoice(battleState: IBattleState): boolean {
    return false;
  }

  public static isPlayerTurn(battleState: IBattleState): boolean {
    return true;
  }
}
