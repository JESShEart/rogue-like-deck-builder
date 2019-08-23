import {ICard} from './ICard';
import {IEnemyCharacter, IHeroCharacter} from './ICharacter';
import {IEffect} from './IEffect';

export default interface IBattleState {
  hero: IHeroCharacter;
  enemyList: IEnemyCharacter[];
  deck: ICard[];
  hand: ICard[];
  discardPile: ICard[];
  effectQueue: IEffect[];
  effectLog: IEffect[];
}
