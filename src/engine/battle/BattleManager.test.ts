import BattleManager from './BattleManager';
import BattleStateBuilder from './BattleStateBuilder';
import IBattleState from './IBattleState';
import {CharacterType, IEnemyCharacter, IHeroCharacter} from './ICharacter';

const hero: IHeroCharacter = {characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100};
const enemy: IEnemyCharacter = {characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100};

const initialState = BattleStateBuilder.initial()
  .withHero(hero)
  .withEnemy(enemy)
  .withEnemy(enemy)
  .build();

test('battle manager', () => {
  const stateResponder = (battleState: IBattleState) => {
    return;
  };
  const timeTravelingCallback = (isTimeTraveling: boolean) => {
    return;
  };
  const battleManager = new BattleManager(initialState, stateResponder, timeTravelingCallback);
  expect(battleManager). toBeTruthy();
});
