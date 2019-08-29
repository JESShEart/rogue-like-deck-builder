import BattleHistoryService from './BattleHistoryService';
import {BattleService} from './BattleService';
import BattleTesterService from './BattleTesterService';
import IBattle from './IBattle';
import IBattleHistory from './IBattleHistory';
import {CardType, ICard} from './ICard';

export type Responder = (battleHistory: IBattleHistory) => void;

export default class BattleManager {
  private battleHistory: IBattleHistory;

  private readonly responder: Responder;

  constructor(battleHistory: IBattleHistory, responder: Responder) {
    this.battleHistory = battleHistory;
    this.responder = responder;
  }

  public resume(): void {
    if (!this.isTimeTraveling()) { return; }
    this.battleHistory = BattleHistoryService.resume(this.battleHistory);
    this.run();
  }

  public goBack(): void {
    this.battleHistory = BattleHistoryService.goBack(this.battleHistory);
    this.responder(this.battleHistory);
  }

  public goForward(): void {
    this.battleHistory = BattleHistoryService.goForward(this.battleHistory);
    this.responder(this.battleHistory);
  }

  public run(): void {
    const tester = BattleTesterService;
    const battle = this.battleHistory.battle;

    if (tester.shouldCompleteEffect(battle)) {
      this.next(BattleService.completeActiveEffect(battle));
    }

    if (tester.shouldActivateNextEffect(battle)) {
      this.next(BattleService.activateNextEffect(battle));
    }

    this.responder(this.battleHistory);
  }

  public playCard(card: ICard, targetId: number = -1): void {
    const tester = BattleTesterService;
    const battle = this.battleHistory.battle;
    if (!tester.isPlayerTurn(battle)) { return; }
    if (this.isTimeTraveling()) { this.resume(); }
    while (!tester.canPlayCard(battle)) {
      // basically fast forwarding to let this card get played
      this.run();
    }

    if (!tester.cardWillSucceed(battle, card)) { return; }

    if (card.cardType === CardType.UN_TARGETED) {
      this.next(BattleService.playUnTargetedCard(battle, card), true);
    } else {
      const target = battle.characterMap[targetId];
      this.next(BattleService.playTargetedCard(battle, card, target), true);
    }

    this.run();
  }

  private isTimeTraveling(): boolean {
    return this.battleHistory.history.timeTraveling;
  }

  private next(battle: IBattle, keep: boolean = false): void {
    this.battleHistory = BattleHistoryService.push(this.battleHistory, battle, keep);
  }
}
