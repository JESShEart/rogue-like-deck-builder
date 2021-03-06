import IIdentified from './IIdentified';

export enum CharacterType {
  HERO,
  ENEMY,
}

export interface IHeroCharacter {
  readonly characterType: CharacterType.HERO;
  readonly name: string;
  readonly health: number;
  readonly maxHealth: number;
}

export interface IEnemyCharacter {
  readonly characterType: CharacterType.ENEMY;
  readonly name: string;
  readonly health: number;
  readonly maxHealth: number;
}

export type ICharacter = IHeroCharacter | IEnemyCharacter;

export type IdentifiedEnemy = IIdentified & IEnemyCharacter;
export type IdentifiedHero = IIdentified & IHeroCharacter;

export type IdentifiedCharacter = IdentifiedEnemy | IdentifiedHero;

export interface IIdentifiedCharacterMap {
  [id: number]: IdentifiedCharacter;
}
