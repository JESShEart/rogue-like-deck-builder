import IBattleState from './IBattleState';
import {CharacterType, ICharacter, IEnemyCharacter, IHeroCharacter} from './ICharacter';

export default class CharacterService {
  public static update(
    battleState: IBattleState,
    currentCharacterState: ICharacter,
    newCharacterState: ICharacter,
  ): IBattleState {
    if (
      currentCharacterState.characterType === CharacterType.ENEMY
      && newCharacterState.characterType === CharacterType.ENEMY
    ) {
      return this.updateEnemy(battleState, currentCharacterState, newCharacterState);
    } else if (
      currentCharacterState.characterType === CharacterType.HERO
      && newCharacterState.characterType === CharacterType.HERO
    ) {
      return this.updateHero(battleState, currentCharacterState, newCharacterState);
    } else {
      throw new Error('Character could not be updated.  Mismatched character types.');
    }
  }

  private static updateEnemy(battleState: IBattleState, currentCharacterState: IEnemyCharacter, newCharacterState: IEnemyCharacter) {
    const enemyList = battleState.enemyList.map((c) =>
      c === currentCharacterState ? newCharacterState : c);
    return {
      ...battleState,
      enemyList,
    };
  }

  private static updateHero(battleState: IBattleState, currentCharacterState: IHeroCharacter, newCharacterState: IHeroCharacter) {
    const hero = battleState.hero === currentCharacterState ? newCharacterState : currentCharacterState;
    return {
      ...battleState,
      hero,
    };
  }
}
