import IBattleState from './IBattleState';
import IHistory from './IHistory';

export default interface IBattleStateistory {
  readonly battleState: IBattleState;
  readonly history: IHistory;
}
