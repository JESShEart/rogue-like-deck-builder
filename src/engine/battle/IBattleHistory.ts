import IBattle from './IBattle';
import IHistory from './IHistory';

export default interface IBattleHistory {
  readonly battle: IBattle;
  readonly history: IHistory;
}
