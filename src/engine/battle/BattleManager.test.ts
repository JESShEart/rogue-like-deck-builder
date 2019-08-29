import BattleBuilder from './BattleBuilder';
import IBattle from './IBattle';
import {CharacterType, IEnemyCharacter, IHeroCharacter} from './ICharacter';

const hero: IHeroCharacter = {characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100};
const enemy: IEnemyCharacter = {characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100};

const baseBattle = BattleBuilder.initial()
  .withHero(hero)
  .withEnemy(enemy)
  .withEnemy(enemy)
  .build();

test('battle manager', () => {
  const responder = (battle: IBattle) => {
    return;
  };
  const timeTravelingCallback = (isTimeTraveling: boolean) => {
    return;
  };
});
