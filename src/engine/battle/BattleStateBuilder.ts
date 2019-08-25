import IBattleState from './IBattleState';
import {ICard} from './ICard';
import {IEnemyCharacter, IHeroCharacter} from './ICharacter';

export default class BattleStateBuilder {
  public static initial(): BattleStateBuilder {
    return new BattleStateBuilder(this.defaultState);
  }

  public static from(battleState: IBattleState): BattleStateBuilder {
    return new BattleStateBuilder(battleState);
  }

  private static readonly defaultState: IBattleState = {
    activeEffect: undefined,
    characterMap: {},
    deck: [],
    discardPile: [],
    effectLog: [],
    effectQueue: [],
    enemyList: [],
    hand: [],
    hero: 0,
    mana: 0,
    maxMana: 0,
    nextId: 1,
  };

  private readonly battleState;

  private constructor(battleState: IBattleState) {
    this.battleState = {
      ...BattleStateBuilder.defaultState,
      ...battleState,
    };
  }

  public build(): IBattleState {
    if (!this.battleState.hero) { throw new Error('Invalid state.  Hero must be initialized.'); }
    return this.battleState;
  }

  public withHero(heroCharacter: IHeroCharacter): BattleStateBuilder {
    const id = this.battleState.nextId;
    const hero = {id, ...heroCharacter};
    const characterMap = {...this.battleState.characterMap, [id]: hero};
    const nextId = id + 1;
    return new BattleStateBuilder({
      ...this.battleState,
      characterMap,
      hero: id,
      nextId,
    });
  }

  public withEnemy(enemyCharacter: IEnemyCharacter): BattleStateBuilder {
    const id = this.battleState.nextId;
    const enemy = {id, ...enemyCharacter};
    const enemyList = [...this.battleState.enemyList, id];
    const characterMap = {...this.battleState.characterMap, [id]: enemy};
    const nextId = id + 1;
    return new BattleStateBuilder({
      ...this.battleState,
      characterMap,
      enemyList,
      nextId,
    });
  }

  public withMana(mana: number, maxMana: number): BattleStateBuilder {
    return new BattleStateBuilder({
      ...this.battleState,
      mana,
      maxMana,
    });
  }

  public putCardInDeck(card: ICard): BattleStateBuilder {
    const deck = [...this.battleState.deck, card];
    return new BattleStateBuilder({
      ...this.battleState,
      deck,
    });
  }

  public putCardInHand(card: ICard): BattleStateBuilder {
    const hand = [...this.battleState.hand, card];
    return new BattleStateBuilder({
      ...this.battleState,
      hand,
    });
  }
}
