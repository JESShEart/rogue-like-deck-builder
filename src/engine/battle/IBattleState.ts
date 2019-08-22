import Character from '../character';
import {ICard} from './ICard';
import {IEffect} from './IEffect';

export default interface IBattleState {
  hero: Character;
  enemyList: Character[];
  deck: ICard[];
  hand: ICard[];
  discardPile: ICard[];
  effectQueue: IEffect[];
  effectLog: IEffect[];
}
