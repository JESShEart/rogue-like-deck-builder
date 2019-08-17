import React from 'react';
import Card from '../engine/card';
import CardComponent from './card.component';

interface IState {
  hand: Card[];
}

export default class HandComponent extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      hand: [
        new Card('Card 1', 1, () => null),
        new Card('Card 2', 2, () => null),
        new Card('Card 3', 3, () => null),
        new Card('Card 4', 4, () => null),
        new Card('Card 5', 5, () => null),
      ],
    };
  }

  public render() {
    return (
      <div className='hand'>
        {this.state.hand.map((card) => this.renderCard(card))}
      </div>
    );
  }

  private renderCard(card: Card) {
    return (
      <CardComponent
        card={card}
        onClick={this.handleClick}
      />
    );
  }

  private handleClick(card: Card) {
    const hand = this.state.hand.filter((c) => c !== card);
    this.setState({hand});
  }
}
