import {BattleService} from './BattleService';
import BattleTesterService from './BattleTesterService';
import IBattleState from './IBattleState';
import {CardType, ICard} from './ICard';

export type StateResponder = (battleState: IBattleState) => void;
export type TimeTravelingCallback = (timeTraveling: boolean) => void;

export default class BattleManager {
  private stateResponder: StateResponder;
  private timeTravelingCallback: TimeTravelingCallback;
  private battleState: IBattleState;

  private historyIndex?: number;
  private history: IBattleState[] = [];

  constructor(battleState: IBattleState, stateResponder: StateResponder, timeTravelingCallback: TimeTravelingCallback) {
    this.battleState = battleState;
    this.stateResponder = stateResponder;
    this.timeTravelingCallback = timeTravelingCallback;
  }

  public getHistory(): IBattleState[] {
    return [...this.history];
  }

  public resume(): void {
    if (this.historyIndex === undefined) { return; }
    this.history = this.history.slice(0, this.historyIndex);
    this.historyIndex = undefined;

    this.timeTravelingCallback(this.isTimeTraveling());
    this.run();
  }

  public goTo(historyIndex: number): void {
    if (historyIndex < 0) { return; }
    if (historyIndex >= this.history.length) { return; }
    this.historyIndex = historyIndex;
    this.battleState = this.history[historyIndex];

    this.timeTravelingCallback(this.isTimeTraveling());
    this.next(this.battleState);
  }

  public goBack(): void {
    if (!this.history.length) { return; }
    const backIndex = this.historyIndex === undefined ? this.history.length - 1 : this.historyIndex - 1;
    this.goTo(backIndex);
  }

  public goForward(): void {
    if (this.historyIndex === undefined) { return; }
    if (this.historyIndex + 1 >= this.history.length) { return this.resume(); }
    this.goTo(++this.historyIndex);
  }

  public run(): void {
    const tester = BattleTesterService;
    if (this.isTimeTraveling()) {
      // user must explicitly choose to resume
      return;
    } else if (tester.shouldActivateNextEffect(this.battleState)) {
      this.next(BattleService.activateNextEffect(this.battleState));
    } else if (tester.shouldCompleteEffect(this.battleState)) {
      this.next(BattleService.completeActiveEffect(this.battleState));
      if (tester.shouldActivateNextEffect(this.battleState)) {
        this.next(BattleService.activateNextEffect(this.battleState));
      }
    }
  }

  public playCard(card: ICard, targetId: number = -1): void {
    const tester = BattleTesterService;
    if (!tester.isPlayerTurn(this.battleState)) { return; }
    if (this.isTimeTraveling()) { this.resume(); }
    while (!tester.canPlayCard(this.battleState)) {
      // basically fast forwarding to let this card get played
      this.run();
    }

    if (card.cardType === CardType.UN_TARGETED) {
      this.next(BattleService.playUnTargetedCard(this.battleState, card));
    } else {
      const target = this.battleState.characterMap[targetId];
      this.next(BattleService.playTargetedCard(this.battleState, card, target));
    }

    this.run();
  }

  private isTimeTraveling(): boolean {
    return this.historyIndex !== undefined;
  }

  private next(battleState: IBattleState): void {
    if (!this.isTimeTraveling()) {
      this.history = [...this.history, this.battleState];
    }
    this.battleState = battleState;
    this.stateResponder(battleState);
  }
}
