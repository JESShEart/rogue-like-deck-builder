import {BattleService} from './BattleService';
import BattleTesterService from './BattleTesterService';
import HistoryService from './HistoryService';
import IBattleHistory from './IBattleHistory';
import {CardType, ICard} from './ICard';

export default class BattleHistoryService {

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

  public static playCard(battleHistory: IBattleHistory, card: ICard, targetId: number = -1): IBattleHistory {
    if (!BattleTesterService.isPlayerTurn(battleHistory.battle)) {
      return battleHistory;
    }

    if (battleHistory.history.timeTraveling) {
      battleHistory = BattleHistoryService.resume(battleHistory);
    }

    while (!BattleTesterService.canPlayCard(battleHistory.battle)) {
      // basically fast forwarding to let this card get played
      battleHistory = BattleHistoryService.run(battleHistory);
    }

    if (!BattleTesterService.cardWillSucceed(battleHistory.battle, card)) {
      return battleHistory;
    }

    if (card.cardType === CardType.UN_TARGETED) {
      const battle = BattleService.playUnTargetedCard(battleHistory.battle, card);
      const history = HistoryService.push(battleHistory.history, battle, true);
      battleHistory = {
        battle,
        history,
      };
    } else {
      const target = battleHistory.battle.characterMap[targetId];
      const battle = BattleService.playTargetedCard(battleHistory.battle, card, target);
      const history = HistoryService.push(battleHistory.history, battle, true);
      battleHistory = {
        battle,
        history,
      };
    }

    return BattleHistoryService.run(battleHistory);
  }
}
