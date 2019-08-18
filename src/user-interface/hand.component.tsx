import React from 'react';
import Card from '../engine/card';
import Character from '../engine/character';
import CardComponent from './card.component';

interface IProps {
  hand: Card[];
  playCard: (card: Card, target: Character) => void;
}

export default class HandComponent extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
    this.playCard = this.playCard.bind(this);
  }

  public render() {
    return (
      <div className='hand'>
        {this.props.hand.map((card, key) => this.renderCard(card, key))}
      </div>
    );
  }

  private renderCard(card: Card, key: number) {
    return (
      <CardComponent
        key={key}
        card={card}
        onClick={this.playCard}
      />
    );
  }

  private playCard(card: Card, target: Character) {
    this.props.playCard(card, target);
  }
}
