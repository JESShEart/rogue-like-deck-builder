import {BattleService} from './BattleService';
import BattleStateHistoryService from './BattleStateHistoryService';
import BattleTesterService from './BattleTesterService';
import IBattleState from './IBattleState';
import IBattleStateHistory from './IBattleStateHistory';
import {CardType, ICard} from './ICard';

export type StateResponder = (battleStateHistory: IBattleStateHistory) => void;

export default class BattleManager {
  private battleStateHistory: IBattleStateHistory;

  private readonly stateResponder: StateResponder;

  constructor(battleStateHistory: IBattleStateHistory, stateResponder: StateResponder) {
    this.battleStateHistory = battleStateHistory;
    this.stateResponder = stateResponder;
  }

  public resume(): void {
    if (!this.battleStateHistory.history.timeTraveling) { return; }
    this.battleStateHistory = BattleStateHistoryService.resume(this.battleStateHistory);
    this.run();
  }

  public goBack(): void {
    this.battleStateHistory = BattleStateHistoryService.goBack(this.battleStateHistory);
    this.stateResponder(this.battleStateHistory);
  }

  public goForward(): void {
    this.battleStateHistory = BattleStateHistoryService.goForward(this.battleStateHistory);
    this.stateResponder(this.battleStateHistory);
  }

  public run(): void {
    if (this.isTimeTraveling()) {
      // user must explicitly choose to resume
      return;
    }
    const tester = BattleTesterService;
    const battleState = this.battleStateHistory.battleState;

    if (tester.shouldCompleteEffect(battleState)) {
      this.next(BattleService.completeActiveEffect(battleState));
    }

    if (tester.shouldActivateNextEffect(battleState)) {
      this.next(BattleService.activateNextEffect(battleState));
    }

    this.stateResponder(this.battleStateHistory);
  }

  public playCard(card: ICard, targetId: number = -1): void {
    const tester = BattleTesterService;
    const battleState = this.battleStateHistory.battleState;
    if (!tester.isPlayerTurn(battleState)) { return; }
    if (this.isTimeTraveling()) { this.resume(); }
    while (!tester.canPlayCard(battleState)) {
      // basically fast forwarding to let this card get played
      this.run();
    }

    if (!tester.cardWillSucceed(battleState, card)) { return; }

    if (card.cardType === CardType.UN_TARGETED) {
      this.next(BattleService.playUnTargetedCard(battleState, card), true);
    } else {
      const target = battleState.characterMap[targetId];
      this.next(BattleService.playTargetedCard(battleState, card, target), true);
    }

    this.run();
  }

  private isTimeTraveling(): boolean {
    return this.battleStateHistory.history.timeTraveling;
  }

  private next(battleState: IBattleState, keep: boolean = false): void {
    this.battleStateHistory = BattleStateHistoryService.push(this.battleStateHistory, battleState, keep);
  }
}
