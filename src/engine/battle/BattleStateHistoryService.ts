import HistoryService from './HistoryService';
import IBattleState from './IBattleState';
import IBattleStateHistory from './IBattleStateHistory';

export default class BattleStateHistoryService {
  public static push(battleStateHistory: IBattleStateHistory, battleState: IBattleState, keep: boolean = false): IBattleStateHistory {
    const history = HistoryService.push(battleStateHistory.history, battleState, keep);
    return {
      battleState,
      history,
    };
  }

  public static goBack(battleStateHistory: IBattleStateHistory): IBattleStateHistory {
    const history = HistoryService.goBack(battleStateHistory.history);
    const battleState = history.timeline[history.index];
    return {
      battleState,
      history,
    };
  }

  public static goForward(battleStateHistory: IBattleStateHistory): IBattleStateHistory {
    const history = HistoryService.goForward(battleStateHistory.history);
    const battleState = history.timeline[history.index];
    return {
      battleState,
      history,
    };
  }

  public static resume(battleStateHistory: IBattleStateHistory): IBattleStateHistory {
    const history = HistoryService.resume(battleStateHistory.history);
    const battleState = history.timeline[history.index];
    return {
      battleState,
      history,
    };
  }

  public static reset(battleStateHistory: IBattleStateHistory): IBattleStateHistory {
    const history = HistoryService.reset(battleStateHistory.history);
    const battleState = history.timeline[history.index];
    return {
      battleState,
      history,
    };
  }
}
