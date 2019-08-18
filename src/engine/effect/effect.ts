import Character from '../character';

export type Effect = (target: Character) => void;

export default interface IEffect {
  activate: Effect;
}
