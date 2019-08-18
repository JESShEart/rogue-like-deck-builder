import Character from '../character';

export default interface IEffect {
  activate: (target: Character) => void;
}
