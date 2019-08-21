import Character from '../character';
import {Card} from './ICard';
import {QueuedEffect} from './IEffect';

export default interface IBattleState {
  hero: Character;
  enemyList: Character[];
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  effectQueue: QueuedEffect[];
  effectLog: QueuedEffect[];
}
