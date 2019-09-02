import React from 'react';
import {IdentifiedCard} from '../engine/battle/ICard';
import CardComponent from './card.component';
import './hand.component.css';

interface IProps {
  hand: IdentifiedCard[];
  playCard: (cardId: number, targetId: number) => void;
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

  private renderCard(card: IdentifiedCard, key: number) {
    return (
      <span
        key={key}
        className='card-container'
      >
        <CardComponent
          card={card}
          onClick={this.playCard}
        />
      </span>
    );
  }

  private playCard(cardId: number, targetId: number) {
    this.props.playCard(cardId, targetId);
  }
}
