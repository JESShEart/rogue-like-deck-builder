import {BattleService} from './BattleService';
import BattleTesterService from './BattleTesterService';
import HistoryService from './HistoryService';
import IBattleHistory from './IBattleHistory';

export default class BattleHistoryService {

  public static timeTravel({battle, history}: IBattleHistory) {
    return {
      battle,
      history: HistoryService.timeTravel(history),
    };
  }

  public static goBack(battleHistory: IBattleHistory): IBattleHistory {
    const history = HistoryService.goBack(battleHistory.history);
    const battle = history.timeline[history.index];
    return {
      battle,
      history,
    };
  }

  public static goForward(battleHistory: IBattleHistory): IBattleHistory {
    const history = HistoryService.goForward(battleHistory.history);
    const battle = history.timeline[history.index];
    return {
      battle,
      history,
    };
  }

  public static resume(battleHistory: IBattleHistory): IBattleHistory {
    const history = HistoryService.resume(battleHistory.history);
    const battle = history.timeline[history.index];
    return {
      battle,
      history,
    };
  }

  public static reset(battleHistory: IBattleHistory): IBattleHistory {
    const history = HistoryService.reset(battleHistory.history);
    const battle = history.timeline[history.index];
    return {
      battle,
      history,
    };
  }

  public static run({battle, history}: IBattleHistory): IBattleHistory {
    if (BattleTesterService.shouldCompleteEffect(battle)) {
      battle = BattleService.completeActiveEffect(battle);
    }

    if (BattleTesterService.shouldActivateNextEffect(battle)) {
      battle = BattleService.activateNextEffect(battle);
    }

    history = HistoryService.push(history, battle);

    return {
      battle,
      history,
    };
  }

  public static playCard(battleHistory: IBattleHistory, cardId: number, targetId: number = -1): IBattleHistory {
    if (!BattleTesterService.isPlayerTurn(battleHistory.battle)) {
      return battleHistory;
    }

    if (BattleTesterService.waitingForPlayerChoice(battleHistory.battle)) {
      return battleHistory;
    }

    if (battleHistory.history.timeTraveling) {
      battleHistory = BattleHistoryService.resume(battleHistory);
    }

    while (!BattleTesterService.canPlayCard(battleHistory.battle)) {
      // basically fast forwarding to let this card get played
      battleHistory = BattleHistoryService.run(battleHistory);
    }

    if (!BattleTesterService.cardWillSucceed(battleHistory.battle, cardId)) {
      return battleHistory;
    }

    const battle = BattleService.playCard(battleHistory.battle, cardId, targetId);
    battleHistory = {
      battle,
      history: HistoryService.push(battleHistory.history, battle, true),
    };

    return BattleHistoryService.run(battleHistory);
  }

  public static advancePhase(battleHistory: IBattleHistory): IBattleHistory {
    const battle = BattleService.advanceNonPlayerPhase(battleHistory.battle);
    const history = HistoryService.push(battleHistory.history, battle);
    battleHistory = {
      battle,
      history,
    };
    return BattleHistoryService.run(battleHistory);
  }

  public static endTurn(battleHistory: IBattleHistory): IBattleHistory {
    const battle = BattleService.endTurn(battleHistory.battle);
    const history = HistoryService.push(battleHistory.history, battle, true);
    return {
      battle,
      history,
    };
  }
}
