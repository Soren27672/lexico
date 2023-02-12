import React, { useState, useEffect } from "react";
import { NavLink, Route } from "react-router-dom";
import LeaderboardPage from "./LeaderboardPage";
import PuzzlePage from "./PuzzlePage";
import ShopPage from "./ShopPage";
import randomInteger from "random-int";

function App() {
  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/puzzles/${randomInteger(1,150)}`)
    .then(r => r.json())
    .then(json => console.log(json));
  },[])

  console.log(puzzle);

  return (
    <div className="App">
      <nav>
        <NavLink to="/puzzle">Play!</NavLink>
        <NavLink to="/shop">Upgrade!</NavLink>
        <NavLink to="/leaderboard">Rank!</NavLink>
      </nav>
      <Route exact path="/puzzle">
        <PuzzlePage />
      </Route>
      <Route exact path="/shop">
        <ShopPage />
      </Route>
      <Route exact path="/leaderboard">
        <LeaderboardPage />
      </Route>
      <button onClick={() => setPuzzle(randomInteger(5))}>Rerender</button>
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