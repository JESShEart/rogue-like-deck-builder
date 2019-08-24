import IBattleState from '../IBattleState';
import {CharacterType, IdentifiedCharacter, IdentifiedEnemy, IdentifiedHero,} from '../ICharacter';

export default class CharacterService {
  public static getCharacterById(battleState: IBattleState, id: number): IdentifiedCharacter | undefined {
    if (battleState.hero.id === id) {
      return battleState.hero;
    } else {
      return battleState.enemyList.find((c) => c.id === id);
    }
  }

  public static update(
    battleState: IBattleState,
    character: IdentifiedCharacter,
  ): IBattleState {
    if (character.characterType === CharacterType.HERO) {
      return this.updateHero(battleState, character);
    } else {
      return this.updateEnemy(battleState, character);
    }
  }

  private static updateEnemy(
    battleState: IBattleState,
    enemy: IdentifiedEnemy,
  ): IBattleState {
    const enemyList = battleState.enemyList.map((c) =>
      c.id === enemy.id ? enemy : c);
    return {
      ...battleState,
      enemyList,
    };
  }

  private static updateHero(
    battleState: IBattleState,
    hero: IdentifiedHero,
  ): IBattleState {
    if (battleState.hero.id !== hero.id) { return battleState; }
    return {
      ...battleState,
      hero,
    };
  }
}
