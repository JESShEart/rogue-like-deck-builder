import React from 'react';
import './App.css';
import Card from './engine/card';
import Target from './engine/target';
import logo from './logo.svg';

const myAction = (target: Target) => {
  target.health = target.health - 5;
};

const aCard = (): Card => {
  return new Card(4, myAction);
};

const myCard = aCard();
const myTarget = new Target(100);

const App: React.FC = () => {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to cause an error. {myCard.cost} {myTarget.health}
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <ul>
          <button onClick={() => {myCard.play(myTarget); console.log(myTarget.health); }}>Play</button>
          <button onClick={() => {myCard.play(myTarget); console.log(myTarget.health); }}>Play</button>
          <button onClick={() => {myCard.play(myTarget); console.log(myTarget.health); }}>Play</button>
          <button onClick={() => {myCard.play(myTarget); console.log(myTarget.health); }}>Play</button>
        </ul>
      </header>
    </div>
  );
};

export default App;
