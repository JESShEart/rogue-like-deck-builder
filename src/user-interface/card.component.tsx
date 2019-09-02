import React from 'react';
import {DragDropContainer} from 'react-drag-drop-container';
import {IdentifiedCard} from '../engine/battle/ICard';
import './card.component.css';

interface IProps {
  card: IdentifiedCard;
  onClick: (cardId: number, targetId: number) => any;
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
          <div>{this.props.card.name}</div>
        </div>
      </DragDropContainer>
    );
  }

  private cardClicked({dropData}) {
    this.props.onClick(this.props.card.id, dropData);
  }
}
