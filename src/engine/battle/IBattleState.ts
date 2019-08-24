import {ICard} from './ICard';
import {IdentifiedEnemy, IdentifiedHero} from './ICharacter';
import {IEffect} from './IEffect';

export default interface IBattleState {
  hero: IdentifiedHero;
  enemyList: IdentifiedEnemy[];
  deck: ICard[];
  hand: ICard[];
  discardPile: ICard[];
  effectQueue: IEffect[];
  effectLog: IEffect[];
}
