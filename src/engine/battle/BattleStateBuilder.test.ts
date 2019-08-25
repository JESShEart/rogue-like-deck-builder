import BattleStateBuilder from './BattleStateBuilder';
import {CharacterType, IEnemyCharacter, IHeroCharacter} from './ICharacter';

const hero: IHeroCharacter = {characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100};
const enemy: IEnemyCharacter = {characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100};

test('throws error when no hero', () => {
  const builder = BattleStateBuilder.initial();
  expect(builder.build).toThrowError();
});

test('build intitial', () => {
  const battleState = BattleStateBuilder.initial()
    .withHero(hero)
    .withEnemy(enemy)
    .withEnemy(enemy)
    .build();

  expect(battleState.nextId).toBe(4);
  expect(battleState.enemyList.length).toBe(2);

  const HERO = battleState.hero;
  expect(HERO).toBe(1);
  expect(battleState.characterMap[HERO]).toBeTruthy();

  const ENEMY1 = battleState.enemyList[0];
  expect(ENEMY1).toBe(2);
  expect(battleState.characterMap[ENEMY1]).toBeTruthy();

  const ENEMY2 = battleState.enemyList[1];
  expect(ENEMY2).toBe(3);
  expect(battleState.characterMap[ENEMY2]).toBeTruthy();
});

test('build from', () => {
  let battleState = BattleStateBuilder.initial()
    .withHero(hero)
    .build();

  battleState = BattleStateBuilder.from(battleState)
    .withEnemy(enemy)
    .build();

  expect(battleState.nextId).toBe(3);
  expect(battleState.enemyList.length).toBe(1);

  const HERO = battleState.hero;
  expect(HERO).toBe(1);
  expect(battleState.characterMap[HERO]).toBeTruthy();

  const ENEMY1 = battleState.enemyList[0];
  expect(ENEMY1).toBe(2);
  expect(battleState.characterMap[ENEMY1]).toBeTruthy();
});

test('build initial with mana', () => {
  const battleState = BattleStateBuilder.initial()
    .withHero(hero)
    .withMana(1, 2)
    .build();
  const {mana, maxMana} = battleState;
  expect(mana).toBe(1);
  expect(maxMana).toBe(2);
});
