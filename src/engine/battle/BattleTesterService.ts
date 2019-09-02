import IBattle, {Phase} from './IBattle';

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

  public static cardWillSucceed(battle: IBattle, cardId: number): boolean {
    return battle.mana >= battle.cardMap[cardId].cost;
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
