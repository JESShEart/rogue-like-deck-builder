import {ICard} from './ICard';
import {IIdentifiedCharacterMap} from './ICharacter';
import {IEffect} from './IEffect';

export default interface IBattleState {
  mana: number;
  maxMana: number;

  hero: number;
  enemyList: number[];
  characterMap: IIdentifiedCharacterMap;

  deck: ICard[];
  hand: ICard[];
  discardPile: ICard[];

  activeEffect?: IEffect;
  effectQueue: IEffect[];
  effectLog: IEffect[];

  nextId: number;
}
