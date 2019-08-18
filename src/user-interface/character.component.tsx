import React from 'react';
import {DropTarget} from 'react-drag-drop-container';
import Character from '../engine/character';
import logo from '../logo.svg';
import './character.component.css';
import HealthBarComponent from './health-bar.component';

interface IProps {
  character: Character;
}

export default class CharacterComponent extends React.Component<IProps> {
  public render() {
    return (
      <div
        className='character'
      >
        <DropTarget
          targetKey='character'
          dropData={this.props.character}
        >
          <HealthBarComponent
            character={this.props.character}
          />
          <div>
            <img src={logo} className='App-logo' alt='logo'/>
          </div>
        </DropTarget>
      </div>
    );
  }
}
