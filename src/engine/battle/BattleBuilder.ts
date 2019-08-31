import IBattle, {Phase} from './IBattle';
import {ICard} from './ICard';
import {IEnemyCharacter, IHeroCharacter} from './ICharacter';

export default class BattleBuilder {
  public static initial(): BattleBuilder {
    return new BattleBuilder(this.defaultBattle);
  }

  public static from(battle: IBattle): BattleBuilder {
    return new BattleBuilder(battle);
  }

  private static readonly defaultBattle: IBattle = {
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
    phase: Phase.UPKEEP,
  };

  private readonly battle;

  private constructor(battle: IBattle) {
    this.battle = {
      ...BattleBuilder.defaultBattle,
      ...battle,
    };
  }

  public build(): IBattle {
    if (!this.battle.hero) { throw new Error('Invalid battle.  Hero must be initialized.'); }
    return this.battle;
  }

  public withHero(heroCharacter: IHeroCharacter): BattleBuilder {
    const id = this.battle.nextId;
    const hero = {id, ...heroCharacter};
    const characterMap = {...this.battle.characterMap, [id]: hero};
    const nextId = id + 1;
    return new BattleBuilder({
      ...this.battle,
      characterMap,
      hero: id,
      nextId,
    });
  }

  public withEnemy(enemyCharacter: IEnemyCharacter): BattleBuilder {
    const id = this.battle.nextId;
    const enemy = {id, ...enemyCharacter};
    const enemyList = [...this.battle.enemyList, id];
    const characterMap = {...this.battle.characterMap, [id]: enemy};
    const nextId = id + 1;
    return new BattleBuilder({
      ...this.battle,
      characterMap,
      enemyList,
      nextId,
    });
  }

  public withMana(mana: number, maxMana: number): BattleBuilder {
    return new BattleBuilder({
      ...this.battle,
      mana,
      maxMana,
    });
  }

  public withPhase(phase: Phase): BattleBuilder {
    return new BattleBuilder({
      ...this.battle,
      phase,
    });
  }

  public putCardInDeck(card: ICard): BattleBuilder {
    const deck = [...this.battle.deck, card];
    return new BattleBuilder({
      ...this.battle,
      deck,
    });
  }

  public putCardInHand(card: ICard): BattleBuilder {
    const hand = [...this.battle.hand, card];
    return new BattleBuilder({
      ...this.battle,
      hand,
    });
  }
}
