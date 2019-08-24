import IBattleState from '../IBattleState';
import {CharacterType} from '../ICharacter';
import CharacterService from './CharacterService';

const baseState: IBattleState = {
  deck: [],
  discardPile: [],
  effectLog: [],
  effectQueue: [],
  enemyList: [{id: 1, characterType: CharacterType.ENEMY, health: 100, maxHealth: 100}],
  hand: [],
  hero: {id: 0, characterType: CharacterType.HERO, health: 100, maxHealth: 100},
};

test('update enemy', () => {
  const character = {...baseState.enemyList[0], health: 90};
  const resultBattleState = CharacterService.update(baseState, character);
  expect(resultBattleState.enemyList[0].health).toBe(90);
});

test('update same enemy twice', () => {
  const character = baseState.enemyList[0];

  const stateResult1 = CharacterService
    .update(baseState, {...character, health: 90});

  const stateResult2 = CharacterService
    .update(stateResult1, {...character, health: 80});

  expect(stateResult2.enemyList[0].health).toBe(80);
});

test('update hero', () => {
  const character = {...baseState.hero, health: 90};
  const {hero} = CharacterService.update(baseState, character);
  expect(hero.health).toBe(90);
});

test('update hero twice', () => {
  const character = baseState.hero;

  const stateResult1 = CharacterService
    .update(baseState, {...character, health: 90});

  const {hero} = CharacterService
    .update(stateResult1, {...character, health: 80});

  expect(hero.health).toBe(80);
});
