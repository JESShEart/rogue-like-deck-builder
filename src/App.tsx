import React from 'react';
import './App.css';
import {getInitialBattleHistory} from './engine/data/InitialBattleState';
import BattleComponent from './user-interface/battle.component';

const App: React.FC = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <BattleComponent
          initialState={getInitialBattleHistory()}
        />
      </header>
    </div>
  );
};

export default App;
