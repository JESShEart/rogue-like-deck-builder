import React from 'react';
import BattleHistoryService from '../engine/battle/BattleHistoryService';
import IBattleHistory from '../engine/battle/IBattleHistory';
import CharacterComponent from './character.component';
import HandComponent from './hand.component';
import TimeTravelComponent from './time-travel.component';

interface IProps {
  initialState: IBattleHistory;
}

export default class BattleComponent extends React.Component<IProps, IBattleHistory> {
  private animationDelay;

  constructor(props: any) {
    super(props);

    this.updateBattle = this.updateBattle.bind(this);
    this.playCard = this.playCard.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.resume = this.resume.bind(this);

    this.state = this.props.initialState;
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
          hand={this.state.battle.hand.map((id) => this.state.battle.cardMap[id])}
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

  private goBack() {
    this.setState(BattleHistoryService.goBack(this.state));
  }

  private goForward() {
    this.setState(BattleHistoryService.goForward(this.state));
  }

  private resume() {
    this.updateBattle(BattleHistoryService.resume(this.state));
  }

  private playCard(cardId: number, targetId: number) {
    this.updateBattle(BattleHistoryService.playCard(this.state, cardId, targetId));
  }

  private updateBattle(battleHistory: IBattleHistory) {
    this.setState(battleHistory);
    if (battleHistory.battle.activeEffect) {
      if (this.animationDelay) {
        clearTimeout(this.animationDelay);
      }
      this.animationDelay = setTimeout(() => {
        this.animationDelay = undefined;
        this.updateBattle(BattleHistoryService.run(battleHistory));
      }, 750);
    }
  }

}
