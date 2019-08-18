import React from 'react';
import Card from '../engine/card';
import Character from '../engine/character';
import DamageEffect from '../engine/effect/damage-effect';
import logo from '../logo.svg';
import HandComponent from './hand.component';
import HealthBarComponent from './health-bar.component';

interface IState {
  enemy: Character;
  hand: Card[];
}

export default class BattleComponent extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      enemy: new Character(25),
      hand: [
        new Card('Card 1', 1, new DamageEffect(5)),
        new Card('Card 2', 2, new DamageEffect(5)),
        new Card('Card 3', 3, new DamageEffect(5)),
        new Card('Card 4', 4, new DamageEffect(5)),
        new Card('Card 5', 5, new DamageEffect(5)),
      ],
    };
  }

  public render() {
    return (
      <div className='hand'>
        <HealthBarComponent
          character={this.state.enemy}
        />
        <div>
          <img src={logo} className='App-logo' alt='logo'/>
        </div>
        <HandComponent
          hand={this.state.hand}
          playCard={this.handleClick}
        />
      </div>
    );
  }

  private handleClick(card: Card) {
    const hand = this.state.hand.filter((c) => c !== card);
    card.play(this.state.enemy);
    this.setState({...this.state, hand});
  }
}
