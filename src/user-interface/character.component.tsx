import React from 'react';
import {DropTarget} from 'react-drag-drop-container';
import {IdentifiedCharacter} from '../engine/battle/ICharacter';
import {IEffect} from '../engine/battle/IEffect';
import logo from '../logo.svg';
import CharacterEffectComponent from './character-effect.component';
import './character.component.css';
import HealthBarComponent from './health-bar.component';

interface IProps {
  character: IdentifiedCharacter;
  effect?: IEffect;
}

export default class CharacterComponent extends React.Component<IProps> {
  private static renderEffect(character: IdentifiedCharacter, effect?: IEffect) {
    if (!effect) { return; }
    if ('targetId' in effect && 'amount' in effect && effect.targetId === character.id) {
      return (
        <CharacterEffectComponent
          effect={effect}
        />
      );
    }
  }

  public render() {
    return (
      <div
        className='character'
      >
        {CharacterComponent.renderEffect(this.props.character, this.props.effect)}
        <DropTarget
          targetKey='character'
          dropData={this.props.character.id}
        >
          {this.props.character.name}
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
