import IBattleState from './IBattleState';

export default interface IHistory {
  readonly timeTraveling: boolean;
  readonly index: number;
  readonly timeline: IBattleState[];
}
