import React from 'react';
import BattleManager from '../engine/battle/BattleManager';
import BattleStateBuilder from '../engine/battle/BattleStateBuilder';
import IBattleState from '../engine/battle/IBattleState';
import {CardType, ICard, ITargetedCard} from '../engine/battle/ICard';
import {CharacterType} from '../engine/battle/ICharacter';
import {EffectType} from '../engine/battle/IEffect';
import CharacterComponent from './character.component';
import HandComponent from './hand.component';

interface IState {
  battleState: IBattleState;
  timeTraveling: boolean;
}

export default class BattleComponent extends React.Component<any, IState> {
  private battleManager: BattleManager;
  private animationDelay;

  constructor(props: any) {
    super(props);
    this.updateBattleState = this.updateBattleState.bind(this);
    this.handleClick = this.handleClick.bind(this);

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
    const timeTraveling = false;
    this.state = {
      battleState,
      timeTraveling,
    };

    this.battleManager = new BattleManager(this.state.battleState, this.updateBattleState);
  }

  public render() {
    return (
      <div>
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
          playCard={this.handleClick}
        />
        <p>
          Mana {this.state.battleState.mana} / {this.state.battleState.maxMana}
        </p>
      </div>
    );
  }

  private updateBattleState(battleState: IBattleState) {
    this.setState({battleState});
    if (battleState.activeEffect) {
      if (this.animationDelay) { clearTimeout(this.animationDelay); }
      this.animationDelay = setTimeout(() => {
        this.battleManager.run();
        this.animationDelay = undefined;
      }, 750);
    }
  }

  private handleClick(card: ICard, targetId: number) {
    this.battleManager.playCard(card, targetId);
  }
}
