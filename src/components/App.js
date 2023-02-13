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
  const [userData, setUserData] = useState({
    points: {
      gross: 0,
      spent: 0,
      net: 0
    },
    bonusData: {
      rapidInput: {
        level: 0,
        value: 0,
      },
      lifesaver: 0,
      luckyLetter: {
        level: 0,
        letter: null,
      }
    },
    time: 0
  })

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
      finalValue: calculateValue(json.array,gameData.valueData.base,gameData.valueData.coefficient),
      revealed: json.array.map(cv => cv === " " ? null : false),
      guesses: {},
      strikes: 0,
      lifesavers: null,
      rapidInputs: null,
      completed: false,
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

  function puzzleCompleted(value) {
    setUserData(data => {
      return {...data,
        points: {...data.points,
          gross: data.points.gross + value,
          net: data.points.gross + value - data.points.spent
        }
      }
    })
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
      <p>{`Points: ${userData.points.net}`}</p>
      <nav>
        <NavLink to="/puzzle">Play!</NavLink>
        <NavLink to="/shop">Upgrade!</NavLink>
        <NavLink to="/leaderboard">Rank!</NavLink>
      </nav>
      <Route exact path="/puzzle">
        <PuzzlePage
        puzzleData={puzzle}
        setPuzzleData={setPuzzle}
        newPuzzle={getPuzzle}
        puzzleCompleted={puzzleCompleted}
        userData={userData}/>
      </Route>
      <Route exact path="/shop">
        <ShopPage />
      </Route>
      <Route exact path="/leaderboard">
        <LeaderboardPage />
      </Route>
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