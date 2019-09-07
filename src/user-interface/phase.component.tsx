import React from 'react';
import {Phase} from '../engine/battle/IBattle';
import './phase.component.css';

interface IProps {
  phase: Phase;
}

const phasePassed = (phase: Phase, currentPhase: Phase) => phase < currentPhase;

const phaseName = (phase: Phase) => {
  switch (phase) {
    case Phase.UPKEEP:
      return 'Upkeep';
    case Phase.ENEMY_CHOOSE_ACTION:
      return 'Enemy Choose Actions';
    case Phase.DRAW:
      return 'Draw';
    case Phase.PLAYER_ACTION:
      return 'Main';
    case Phase.ENEMY_ACTION:
      return 'Enemy Action';
    default:
      return 'Unknown';
  }
};

const renderPhase = (current: Phase, phase: Phase) => {
  const phasePassedClassName = phasePassed(phase, current) ? 'passed' : '';
  const currentClassName = phase === current ? 'current' : '';
  const phaseClassName = ['phase', currentClassName, phasePassedClassName].join(' ');
  return (
    <div
      className={phaseClassName}
    >
      {phase}: {phaseName(phase)}
    </div>
  );
};

export default class PhaseComponent extends React.Component<IProps> {
  public render() {
    return (
      <div className='phase-container'>
        {renderPhase(this.props.phase, Phase.UPKEEP)}
        {renderPhase(this.props.phase, Phase.ENEMY_CHOOSE_ACTION)}
        {renderPhase(this.props.phase, Phase.DRAW)}
        {renderPhase(this.props.phase, Phase.PLAYER_ACTION)}
        {renderPhase(this.props.phase, Phase.ENEMY_ACTION)}
      </div>
    );
  }
}
