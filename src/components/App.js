import React, { useState, useEffect } from "react";
import { NavLink, Route } from "react-router-dom";
import LeaderboardPage from "./LeaderboardPage";
import PuzzlePage from "./PuzzlePage";
import ShopPage from "./ShopPage";
import randomInteger from "random-int";
import randomItem from 'random-item';

function App() {
  const [initialized, setInitialized] = useState({
    initializedUnusedIds: false,
    initializedGameData: false
  });
  const [puzzle, setPuzzle] = useState(null);
  const [unusedIds, setUnusedIds] = useState([]);
  const [gameData, setGameData] = useState({});

  function initialRender(){
    fetch('http://localhost:3000/puzzles')
    .then(r => r.json())
    .then(json => {
      setUnusedIds(json.map(cv => cv.id));
      setInitialized(current => {
        return {...current, initializedUnusedIds: true}
      });
    });

    fetch('http://localhost:3000/gameData')
    .then(r => r.json())
    .then(json => {
      setGameData({...json, 
        valueData: {...(json.valueData),
          coefficient: json.valueData.variance / json.valueData.maxLetterValue
        }
      })
      setInitialized(current => {
        return {...current, initializedGameData: true}
      });
    })
  }

  function getPuzzle() {
    fetch(`http://localhost:3000/puzzles/${randomItem(unusedIds)}`)
    .then(r => r.json())
    .then(json => {
      setPuzzle({
      string: json.string,
      array: json.array,
      category: json.category,
      value: calculateValue(json.array,gameData.valueData.base,gameData.valueData.coefficient),
      revealed: json.array.map(cv => cv === " " ? null : false),
      guesses: {},
      strikes: 0,
      lifesavers: null,
      rapidInputs: null
    })
    setUnusedIds(current => [...current].filter(cv => cv !== json.id));
  });
  }

  function calculateValue(lettersArray,base,coefficient) {
    const lettersOnly = lettersArray.filter(letter => letter !== ' ');
    const letterValueSum = lettersOnly.reduce((ac,letter) => ac + gameData.valueData[letter],0);
    const averageValue = letterValueSum / lettersOnly.length;

    return base + Math.ceil(averageValue * coefficient);
  }

  useEffect(initialRender,[]);

  useEffect(() => {
    for(const key in initialized) {
      if(!initialized[key]) return;
    }
    getPuzzle();
  },[initialized])

  useEffect(() => {
    console.log(puzzle);
  },[puzzle])

  if(puzzle === null) return <h1>Loading!</h1>

  return (
    <div className="App">
      <nav>
        <NavLink to="/puzzle">Play!</NavLink>
        <NavLink to="/shop">Upgrade!</NavLink>
        <NavLink to="/leaderboard">Rank!</NavLink>
      </nav>
      <Route exact path="/puzzle">
        <PuzzlePage puzzleData={puzzle} setPuzzleData={setPuzzle}/>
      </Route>
      <Route exact path="/shop">
        <ShopPage />
      </Route>
      <Route exact path="/leaderboard">
        <LeaderboardPage />
      </Route>
      <button onClick={() =>{
        setPuzzle({
          string: 'Q',
          array: ['Q'],
          category: 'Test',
          value: calculateValue(['Q'],gameData.valueData.base,gameData.valueData.coefficient),
          revealed: [false],
          guesses: {},
          strikes: 0,
          lifesavers: null,
          rapidInputs: null
        })
        }}>Set to Q</button>
      <button onClick={() =>{
        setPuzzle({
          string: 'E',
          array: ['E'],
          category: 'Test',
          value: calculateValue(['E'],gameData.valueData.base,gameData.valueData.coefficient),
          revealed: [false],
          guesses: {},
          strikes: 0,
          lifesavers: null,
          rapidInputs: null
        })
        }}>Set to E</button>
    </div>
  );
}

export default App;


/*

${process.env.REACT_APP_URL}/puzzles/${randomInteger(1,150)}


App
> Nav
> PuzzlePage
  > time //> complex functionality is most approriate held in Puzzlepage, does not need extraction
  > category //> Has no complex functionality deserving of extraction
  > Blanks //> Extracts functionality that displays puzzle progress based on puzzleObj
  > Value //> Concerned with displaying modifiers/math to create final score
  > Strikes //> Extracts functionality that displays incorrect guessses
  > thumbnailDiv //> Has no complex functionality deserving of extraction
> ShopPage
> LeaderboardPage


*/