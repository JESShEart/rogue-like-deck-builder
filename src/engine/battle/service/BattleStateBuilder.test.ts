import {CharacterType} from '../ICharacter';
import BattleStateBuilder from './BattleStateBuilder';

test('throws error when no hero', () => {
  const builder = BattleStateBuilder.initial();
  expect(builder.build).toThrowError();
});

test('build intitial', () => {
  const battleState = BattleStateBuilder.initial()
    .withHero({characterType: CharacterType.HERO, health: 100, maxHealth: 100})
    .withEnemy({characterType: CharacterType.ENEMY, health: 100, maxHealth: 100})
    .withEnemy({characterType: CharacterType.ENEMY, health: 100, maxHealth: 100})
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

test('build intitial', () => {
  const battleState = BattleStateBuilder.initial()
    .withHero({characterType: CharacterType.HERO, health: 100, maxHealth: 100})
    .withEnemy({characterType: CharacterType.ENEMY, health: 100, maxHealth: 100})
    .withEnemy({characterType: CharacterType.ENEMY, health: 100, maxHealth: 100})
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
    .withHero({characterType: CharacterType.HERO, health: 100, maxHealth: 100})
    .build();

  battleState = BattleStateBuilder.from(battleState)
    .withEnemy({characterType: CharacterType.ENEMY, health: 100, maxHealth: 100})
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
