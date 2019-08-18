import React from 'react';
import Character from '../engine/character';

interface IProps {
  character: Character;
}

export default class HealthBarComponent extends React.Component<IProps> {
  public render() {
    return (
      <progress
        max={this.props.character.maxHealth}
        value={this.props.character.health}
      />
    );
  }
}
