import React from 'react';
import {ICharacter} from '../engine/battle/ICharacter';
import './health-bar.component.css';

interface IProps {
  character: ICharacter;
}

export default class HealthBarComponent extends React.Component<IProps> {
  public render() {
    return (
      <div>
        <progress
          className='health-bar'
          max={this.props.character.maxHealth}
          value={this.props.character.health}
        />
        <div className='health-text'>
          {this.props.character.health}/{this.props.character.maxHealth} HP
        </div>
      </div>
    );
  }
}
