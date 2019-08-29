import HistoryService from './HistoryService';
import IBattle from './IBattle';
import IBattleHistory from './IBattleHistory';

export default class BattleHistoryService {
  public static push(battleHistory: IBattleHistory, battle: IBattle, keep: boolean = false): IBattleHistory {
    const history = HistoryService.push(battleHistory.history, battle, keep);
    return {
      battle,
      history,
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
}
