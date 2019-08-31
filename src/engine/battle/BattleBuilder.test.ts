import BattleBuilder from './BattleBuilder';
import {Phase} from './IBattle';
import {CharacterType, IEnemyCharacter, IHeroCharacter} from './ICharacter';

const hero: IHeroCharacter = {characterType: CharacterType.HERO, name: 'hero', health: 100, maxHealth: 100};
const enemy: IEnemyCharacter = {characterType: CharacterType.ENEMY, name: 'enemy', health: 100, maxHealth: 100};

test('throws error when no hero', () => {
  const builder = BattleBuilder.initial();
  expect(builder.build).toThrowError();
});

test('build intitial', () => {
  const battle = BattleBuilder.initial()
    .withHero(hero)
    .withEnemy(enemy)
    .withEnemy(enemy)
    .build();

  expect(battle.nextId).toBe(4);
  expect(battle.enemyList.length).toBe(2);

  const HERO = battle.hero;
  expect(HERO).toBe(1);
  expect(battle.characterMap[HERO]).toBeTruthy();

  const ENEMY1 = battle.enemyList[0];
  expect(ENEMY1).toBe(2);
  expect(battle.characterMap[ENEMY1]).toBeTruthy();

  const ENEMY2 = battle.enemyList[1];
  expect(ENEMY2).toBe(3);
  expect(battle.characterMap[ENEMY2]).toBeTruthy();
});

test('build from', () => {
  let battle = BattleBuilder.initial()
    .withHero(hero)
    .build();

  battle = BattleBuilder.from(battle)
    .withEnemy(enemy)
    .build();

  expect(battle.nextId).toBe(3);
  expect(battle.enemyList.length).toBe(1);

  const HERO = battle.hero;
  expect(HERO).toBe(1);
  expect(battle.characterMap[HERO]).toBeTruthy();

  const ENEMY1 = battle.enemyList[0];
  expect(ENEMY1).toBe(2);
  expect(battle.characterMap[ENEMY1]).toBeTruthy();
});

test('build initial with mana', () => {
  const battle = BattleBuilder.initial()
    .withHero(hero)
    .withMana(1, 2)
    .build();
  const {mana, maxMana} = battle;
  expect(mana).toBe(1);
  expect(maxMana).toBe(2);
});

test('build initial with phase', () => {
  const battle = BattleBuilder.initial()
    .withHero(hero)
    .withPhase(Phase.PLAYER_ACTION)
    .build();
  const {phase} = battle;
  expect(phase).toBe(Phase.PLAYER_ACTION);
});

test('build initial without phase', () => {
  const battle = BattleBuilder.initial()
    .withHero(hero)
    .build();
  const {phase} = battle;
  expect(phase).toBe(Phase.UPKEEP);
});
