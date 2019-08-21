import React from 'react';
import Card from '../engine/card';
import Character from '../engine/character';
import DamageEffect from '../engine/effect/damage-effect';
import CharacterComponent from './character.component';
import HandComponent from './hand.component';

interface IState {
  enemyList: Character[];
  hand: Card[];
}

export default class BattleComponent extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      enemyList: [
        new Character(25),
        new Character(25),
      ],
      hand: [
        new Card('Deal 5 damage', 1, new DamageEffect(5)),
        new Card('Deal 5 damage', 1, new DamageEffect(5)),
        new Card('Deal 10 damage', 2, new DamageEffect(10)),
        new Card('Deal 10 damage', 2, new DamageEffect(10)),
        new Card('Deal 15 damage', 3, new DamageEffect(15)),
        new Card('Deal 5 damage', 1, new DamageEffect(5)),
      ],
    };
  }

  public render() {
    return (
      <div>
        <CharacterComponent
          character={this.state.enemyList[0]}
        />
        <CharacterComponent
          character={this.state.enemyList[1]}
        />
        <HandComponent
          hand={this.state.hand}
          playCard={this.handleClick}
        />
      </div>
    );
  }

  private handleClick(card: Card, target: Character) {
    card.play(target);
    const enemyList = this.state.enemyList;
    const hand = this.state.hand.filter((c) => c !== card);
    this.setState({enemyList, hand});
  }
}
