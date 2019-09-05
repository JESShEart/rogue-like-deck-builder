import {IIdentifiedCardMap} from './ICard';
import {IIdentifiedCharacterMap} from './ICharacter';
import {IEffect} from './IEffect';

export enum Phase {
  UPKEEP = 0,
  ENEMY_CHOOSE_ACTION = 1,
  DRAW = 2,
  PLAYER_ACTION = 3,
  ENEMY_ACTION = 4,
}

export default interface IBattle {
  readonly phase: Phase;
  readonly turn: number;

  readonly mana: number;
  readonly maxMana: number;

  readonly hero: number;
  readonly enemyList: number[];
  readonly characterMap: IIdentifiedCharacterMap;

  readonly deck: number[];
  readonly hand: number[];
  readonly discardPile: number[];
  readonly cardMap: IIdentifiedCardMap;

  readonly activeEffect?: IEffect;
  readonly effectQueue: IEffect[];
  readonly effectLog: IEffect[];

  readonly nextId: number;
}
