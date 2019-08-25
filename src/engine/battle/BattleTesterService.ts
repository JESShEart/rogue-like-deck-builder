import IBattleState from './IBattleState';

export default class BattleTesterService {
  public static shouldActivateNextEffect(battleState: IBattleState): boolean {
    if (battleState.activeEffect) {return false; }
    if (!battleState.effectQueue.length) { return false; }
    return true;
  }

  public static shouldCompleteEffect(battleState: IBattleState): boolean {
    if (!battleState.activeEffect) { return false; }
    // TODO determine if the effect requires user feedback and reject
    return true;
  }

  public static canPlayCard(battleState: IBattleState): boolean {
    if (battleState.activeEffect) {return false; }
    if (battleState.effectQueue.length) {return false; }
    return true;
  }

  public static isPlayerTurn(battleState: IBattleState): boolean {
    return true;
  }
}
