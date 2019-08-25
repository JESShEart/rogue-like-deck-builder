import React from 'react';
import {EffectType, ITargetedAmountEffect} from '../engine/battle/IEffect';
import './character-effect.component.css';

interface IProps {
  effect: ITargetedAmountEffect;
}

export default class CharacterEffectComponent extends React.Component<IProps> {
  private static getClassName({effectType}: ITargetedAmountEffect): string {
    let className = 'effect-amount';
    switch (effectType) {
      case EffectType.DAMAGE_TARGET:
        className += ' damage';
        break;
      case EffectType.HEAL_TARGET:
        className += ' heal';
        break;
    }
    return className;
  }

  public render() {
    return (
      <div
        className='effect-container'
      >
        <div
          className={CharacterEffectComponent.getClassName(this.props.effect)}
        >
          {this.props.effect.amount}
        </div>
      </div>
    );
  }
}
