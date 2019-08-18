import React from 'react';
import Character from '../engine/character';
import './health-bar.component.css';

interface IProps {
  character: Character;
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
