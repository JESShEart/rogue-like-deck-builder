import React from 'react';
import BattleBuilder from '../engine/battle/BattleBuilder';
import BattleManager from '../engine/battle/BattleManager';
import IBattle from '../engine/battle/IBattle';
import IBattleHistory from '../engine/battle/IBattleHistory';
import {CardType, ICard, ITargetedCard} from '../engine/battle/ICard';
import {CharacterType} from '../engine/battle/ICharacter';
import {EffectType} from '../engine/battle/IEffect';
import IHistory, {InitialHistory} from '../engine/battle/IHistory';
import CharacterComponent from './character.component';
import HandComponent from './hand.component';
import TimeTravelComponent from './time-travel.component';

export default class BattleComponent extends React.Component<any, IBattleHistory> {
  private battleManager: BattleManager;
  private animationDelay;

  constructor(props: any) {
    super(props);

    this.updateBattle = this.updateBattle.bind(this);
    this.playCard = this.playCard.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.resume = this.resume.bind(this);

    const battleWithoutCards = BattleBuilder.initial()
      .withHero({characterType: CharacterType.HERO, name: 'Hero', health: 100, maxHealth: 100})
      .withEnemy({characterType: CharacterType.ENEMY, name: 'Enemy 1', health: 100, maxHealth: 100})
      .withEnemy({characterType: CharacterType.ENEMY, name: 'Enemy 2', health: 100, maxHealth: 100})
      .withMana(5, 5)
      .build();

    const fiveDamage: ITargetedCard = {
      cardType: CardType.TARGETED,
      cost: 1,
      effectList: [{
        amount: 5,
        effectType: EffectType.DAMAGE_TARGET,
      }],
      name: '5 Damage',
    };

    const sevenDamage: ITargetedCard = {
      cardType: CardType.TARGETED,
      cost: 2,
      effectList: [{
        amount: 7,
        effectType: EffectType.DAMAGE_TARGET,
      }],
      name: '7 Damage',
    };

    const battle: IBattle = {
      ...battleWithoutCards,
      hand: [{...fiveDamage}, {...fiveDamage}, {...sevenDamage}, {...sevenDamage}],
    };
    const history: IHistory = new InitialHistory(battle);
    this.state = {
      battle,
      history,
    };

    this.battleManager = new BattleManager(
      this.state,
      this.updateBattle,
    );
  }

  public render() {
    return (
      <div>
        <CharacterComponent
          character={this.state.battle.characterMap[this.state.battle.hero]}
          effect={this.state.battle.activeEffect}
        />
        <CharacterComponent
          character={this.state.battle.characterMap[this.state.battle.enemyList[0]]}
          effect={this.state.battle.activeEffect}
        />
        <CharacterComponent
          character={this.state.battle.characterMap[this.state.battle.enemyList[1]]}
          effect={this.state.battle.activeEffect}
        />
        <HandComponent
          hand={this.state.battle.hand}
          playCard={this.playCard}
        />
        <p>
          Mana {this.state.battle.mana} / {this.state.battle.maxMana}
        </p>
        <TimeTravelComponent
          timeTraveling={this.state.history.timeTraveling}
          goBack={this.goBack}
          goForward={this.goForward}
          resume={this.resume}
        />
      </div>
    );
  }

  private updateBattle(battleHistory: IBattleHistory) {
    this.setState(battleHistory);
    if (battleHistory.battle.activeEffect) {
      if (this.animationDelay) { clearTimeout(this.animationDelay); }
      this.animationDelay = setTimeout(() => {
        this.battleManager.run();
        this.animationDelay = undefined;
      }, 750);
    }
  }

  private goBack() {
    this.battleManager.goBack();
  }

  private goForward() {
    this.battleManager.goForward();
  }

  private resume() {
    this.battleManager.resume();
  }

  private playCard(card: ICard, targetId: number) {
    this.battleManager.playCard(card, targetId);
  }
}
