import {ICard} from './ICard';
import {IIdentifiedCharacterMap} from './ICharacter';
import {IEffect} from './IEffect';

export default interface IBattleState {
  readonly mana: number;
  readonly maxMana: number;

  readonly hero: number;
  readonly enemyList: number[];
  readonly characterMap: IIdentifiedCharacterMap;

  readonly deck: ICard[];
  readonly hand: ICard[];
  readonly discardPile: ICard[];

  readonly activeEffect?: IEffect;
  readonly effectQueue: IEffect[];
  readonly effectLog: IEffect[];

  readonly nextId: number;
}
