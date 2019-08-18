import React from 'react';
import {DragDropContainer} from 'react-drag-drop-container';
import Card from '../engine/card';
import Character from '../engine/character';
import './card.component.css';

interface IProps {
  card: Card;
  onClick: (card: Card, target: Character) => any;
}

export default class CardComponent extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.cardClicked = this.cardClicked.bind(this);
  }

  public render() {
    return (
      <DragDropContainer
        targetKey='character'
        dragData={this.props.card}
        onDrop={this.cardClicked}
      >
        <div className='card'>
          <div>{this.props.card.cost}</div>
          <div>{this.props.card.cardName}</div>
        </div>
      </DragDropContainer>
    );
  }

  private cardClicked({dropData}) {
    this.props.onClick(this.props.card, dropData);
  }
}
