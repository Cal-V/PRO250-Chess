import logo from './logo.svg';
import './App.css';
import Game from './Components/Game';
import { useState } from 'react';

function App() {

  const [play,setPlay] = useState("")

  const getPage = () => {
    switch (play) {
      case "Play": return <Game resetGame={() => setPlay("")} />
      case "960": return <Game resetGame={() => setPlay("")} type="960" />
      default: return <div>
        <h2>Chess :)</h2>
        <button onClick={() => setPlay("Play")}>Start Chess</button>
        <button onClick={() => setPlay("960")}>Start Chess 960</button>
      </div>
    }
  }

  return (
    <div className="App">
      {getPage()}
    </div>
  );
}

export default App;
