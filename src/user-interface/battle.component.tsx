import React from 'react';
import BattleManager from '../engine/battle/BattleManager';
import BattleStateBuilder from '../engine/battle/BattleStateBuilder';
import IBattleState from '../engine/battle/IBattleState';
import IBattleStateHistory from '../engine/battle/IBattleStateHistory';
import {CardType, ICard, ITargetedCard} from '../engine/battle/ICard';
import {CharacterType} from '../engine/battle/ICharacter';
import {EffectType} from '../engine/battle/IEffect';
import IHistory, {InitialHistory} from '../engine/battle/IHistory';
import CharacterComponent from './character.component';
import HandComponent from './hand.component';
import TimeTravelComponent from './time-travel.component';

export default class BattleComponent extends React.Component<any, IBattleStateHistory> {
  private battleManager: BattleManager;
  private animationDelay;

  constructor(props: any) {
    super(props);

    this.updateBattleState = this.updateBattleState.bind(this);
    this.playCard = this.playCard.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.resume = this.resume.bind(this);

    const battleStateWithoutCards = BattleStateBuilder.initial()
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

    const battleState: IBattleState = {
      ...battleStateWithoutCards,
      hand: [{...fiveDamage}, {...fiveDamage}, {...sevenDamage}, {...sevenDamage}],
    };
    const history: IHistory = new InitialHistory(battleState);
    this.state = {
      battleState,
      history,
    };

    this.battleManager = new BattleManager(
      this.state,
      this.updateBattleState,
    );
  }

  public render() {
    return (
      <div>
        <CharacterComponent
          character={this.state.battleState.characterMap[this.state.battleState.hero]}
          effect={this.state.battleState.activeEffect}
        />
        <CharacterComponent
          character={this.state.battleState.characterMap[this.state.battleState.enemyList[0]]}
          effect={this.state.battleState.activeEffect}
        />
        <CharacterComponent
          character={this.state.battleState.characterMap[this.state.battleState.enemyList[1]]}
          effect={this.state.battleState.activeEffect}
        />
        <HandComponent
          hand={this.state.battleState.hand}
          playCard={this.playCard}
        />
        <p>
          Mana {this.state.battleState.mana} / {this.state.battleState.maxMana}
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

  private updateBattleState(battleStateHistory: IBattleStateHistory) {
    this.setState(battleStateHistory);
    if (battleStateHistory.battleState.activeEffect) {
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
