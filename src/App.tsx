import React from 'react';
import './App.css';
import BattleComponent from './user-interface/battle.component';

const App: React.FC = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <BattleComponent/>
      </header>
    </div>
  );
};

export default App;
