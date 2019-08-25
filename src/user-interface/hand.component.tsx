import React from 'react';
import {ICard} from '../engine/battle/ICard';
import CardComponent from './card.component';
import './hand.component.css';

interface IProps {
  hand: ICard[];
  playCard: (card: ICard, targetId: number) => void;
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

  private renderCard(card: ICard, key: number) {
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

  private playCard(card: ICard, targetId: number) {
    this.props.playCard(card, targetId);
  }
}
