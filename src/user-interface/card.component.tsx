import React from 'react';
import Card from '../engine/card';

interface IProps {
  card: Card;
  onClick: (card: Card) => any;
}

export default class CardComponent extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.cardClicked = this.cardClicked.bind(this);
  }

  public render() {
    return (
      <button
        onClick={this.cardClicked}
      >
        {this.props.card.cost}
      </button>
    );
  }

  private cardClicked() {
    this.props.onClick(this.props.card);
  }
}
