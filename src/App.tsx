import React from 'react';
import './App.css';
import logo from './logo.svg';
import HandComponent from './user-interface/hand.component';

const App: React.FC = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <HandComponent/>
      </header>
    </div>
  );
};

export default App;
