import React, { useState, useEffect } from "react";
import { NavLink, Route } from "react-router-dom";
import LeaderboardPage from "./LeaderboardPage";
import PuzzlePage from "./PuzzlePage";
import ShopPage from "./ShopPage";
import randomInteger from "random-int";
import randomItem from 'random-item';

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [unusedIds, setUnusedIds] = useState([]);


  function getPuzzle(override = randomItem(unusedIds)) {
    fetch(`http://localhost:3000/puzzles/${override}`)
    .then(r => r.json())
    .then(json => {
      setPuzzle({
      string: json.string,
      array: json.array,
      category: json.category,
      value: null,
      revealed: json.array.map(cv => cv === " " ? null : false),
      guesses: {},
      strikes: 0,
      lifesavers: null,
      rapidInputs: null
    })
    setUnusedIds(current => [...current].filter(cv => cv !== json.id));
  });
  }

  console.log(puzzle);

  useEffect(() => {
    fetch('http://localhost:3000/puzzles')
    .then(r => r.json())
    .then(json => setUnusedIds(json.map(cv => cv.id)));
    getPuzzle(randomInteger(1,150));
  },[])

  if(puzzle === null) return <h1>Loading!</h1>

  return (
    <div className="App">
      <nav>
        <NavLink to="/puzzle">Play!</NavLink>
        <NavLink to="/shop">Upgrade!</NavLink>
        <NavLink to="/leaderboard">Rank!</NavLink>
      </nav>
      <Route exact path="/puzzle">
        <PuzzlePage puzzleData={puzzle}/>
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