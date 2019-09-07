import React from 'react';
import './mana-bar.component.css';

interface IProps {
  mana: number;
  maxMana: number;
}

const renderMana = (key: number, available: boolean) => {
  const availableClass = available ? 'full' : 'empty';
  const manaContainerClass = ['mana-container', availableClass].join(' ');
  const manaClass = ['mana', availableClass].join(' ');
  return (
    <div
      key={key}
      className={manaContainerClass}
    >
      <div
        className={manaClass}
      />
    </div>
  );
};

const renderManas = ({mana, maxMana}: IProps) =>
  Array.from(Array(maxMana)).map((n, i) => renderMana(i, i < mana));

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
