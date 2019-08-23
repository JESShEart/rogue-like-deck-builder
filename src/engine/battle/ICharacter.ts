export enum CharacterType {
  HERO,
  ENEMY,
}

export interface IHeroCharacter {
  readonly characterType: CharacterType.HERO;
  readonly health: number;
  readonly maxHealth: number;
}

export interface IEnemyCharacter {
  readonly characterType: CharacterType.ENEMY;
  readonly health: number;
  readonly maxHealth: number;
}

export type ICharacter = IHeroCharacter | IEnemyCharacter;
