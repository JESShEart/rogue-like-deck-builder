import IBattle from './IBattle';
import IHistory from './IHistory';

export default class HistoryService {
  public static push(history: IHistory, battle: IBattle, keep: boolean = false): IHistory {
    const timeTraveling = false;
    const kept = keep ? history.timeline : history.timeline.slice(0, history.timeline.length - 1);
    const timeline = [...kept, battle];
    const index = timeline.length - 1;
    return {
      index,
      timeTraveling,
      timeline,
    };
  }

  public static goBack(history: IHistory): IHistory {
    const timeTraveling = true;
    const minIndex = history.timeline.length ? 0 : -1;
    const index = history.index <= 0 ? minIndex : history.index - 1;
    return {
      ...history,
      index,
      timeTraveling,
    };
  }

  public static goForward(history: IHistory): IHistory {
    const timeTraveling = true;
    const lastIndex = history.timeline.length - 1;
    const index = history.index >= lastIndex ? lastIndex : history.index + 1;
    return {
      ...history,
      index,
      timeTraveling,
    };
  }

  public static resume(history: IHistory): IHistory {
    const timeTraveling = false;
    const timeline = history.timeline.slice(0, history.index + 1);
    return {
      ...history,
      timeTraveling,
      timeline,
    };
  }

  public static reset(history: IHistory): IHistory {
    const index = history.timeline.length ? 0 : -1;
    const timeTraveling = false;
    const timeline = history.timeline.length ? [history.timeline[0]] : [];
    return {
      ...history,
      index,
      timeTraveling,
      timeline,
    };
  }
}
