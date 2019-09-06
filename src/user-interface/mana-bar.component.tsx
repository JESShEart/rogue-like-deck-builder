import React from 'react';
import './mana-bar.component.css';

interface IProps {
  mana: number;
  maxMana: number;
}

const renderMana = (available: boolean) => {
  const manaContainerClass = ['mana-container', available ? 'full' : 'empty'].join(' ');
  const manaClass = ['mana', available ? 'full' : 'empty'].join(' ');
  return (
    <div
      className={manaContainerClass}
    >
      <div
        className={manaClass}
      />
    </div>
  );
};

const renderManas = ({mana, maxMana}: IProps) =>
  Array.from(Array(maxMana)).map((n, i) => renderMana(i < mana));

export default class ManaBarComponent extends React.Component<IProps> {
  public render() {
    return (
      <div
        className='mana-bar'
      >
        Energy
        <div>
          {renderManas(this.props)}
        </div>
      </div>
    );
  }
}
