import React, { useState, useEffect, useContext } from "react";
import { NavLink, Redirect, Route } from "react-router-dom";
import LeaderboardPage from "./LeaderboardPage";
import PuzzlePage from "./PuzzlePage";
import ShopPage from "./ShopPage";
import randomInteger from "random-int";
import randomItem from 'random-item';
import formatDuration from "format-duration";
import { globalContext } from "../globalContext";
import Message from "./Message";
import PopUpBoard from "./PopUpBoard";

function App() {
  const [initialized, setInitialized] = useState({
    unusedIds: false,
    gameData: false
  });
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleInitialized, setPuzzleInitialized] = useState(false);
  const [unusedIds, setUnusedIds] = useState([]);
  const [messageData, setMessageData] = useState({
    text: "Lucky You!",
    timeout: null,
    display: "none"
  });
  const [popUpBoardData, setPopUpBoardData] = useState({
    header: "Lucky You!",
    text: "You're in luck!",
    button: "Let's Go!",
    display: "none",
    appFilter: "none",
    appClick: "auto"
  });
  const { gameData, userData, setUserData} = useContext(globalContext);

  function initialRender(){
    fetch(`${process.env.REACT_APP_URL}/puzzles`)
    .then(r => r.json())
    .then(json => {
      setUnusedIds(json.map(cv => cv.id));
      setInitialized(current => {
        return {...current, unusedIds: true}
      });
    });
  }

  function getPuzzle() {
    fetch(`${process.env.REACT_APP_URL}/puzzles/${randomItem(unusedIds)}`)
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
      lifesavers: 0,
      rapidInputs: 0,
      time: 0,
      completed: false,
      completedRan: false
    })
    setPuzzleInitialized(false);
    setUnusedIds(current => [...current].filter(cv => cv !== json.id));
  });
  }

  function calculateValue(lettersArray,base,coefficient) {
    const lettersOnly = lettersArray.filter(letter => letter !== ' ');
    const letterValueSum = lettersOnly.reduce((ac,letter) => ac + gameData.valueData[letter],0);
    const averageValue = letterValueSum / lettersOnly.length;

    return base + Math.ceil(averageValue * coefficient);
  }

  function puzzleCompleted() {
    setUserData(data => {
      return {...data,
        points: {...data.points,
          gross: data.points.gross + puzzle.finalValue,
          net: data.points.gross + puzzle.finalValue - data.points.spent
        },
        time: data.time + puzzle.time
      }
    })
  }

  function updatePuzzle(puzzleObj) {
    setPuzzle({...puzzleObj});
  }

  function sendMessage(text,duration) {
    if (messageData !== null) clearTimeout(messageData.timeout);

    const timeout = setTimeout(() => {
      setMessageData(data => {
        return {...data,
          display: "none"
        }
      });
    },duration * 1000)

    setMessageData({ text: text, timeout: timeout, display: "flex" });
  }

  function sendPopUpBoard(header, text, button) {
    setPopUpBoardData({
      header: header,
      text: text,
      button: button,
      display: "flex",
      appFilter: "brightness(0.75)",
      appClick: "none"
    })
  }

  useEffect(initialRender,[]);

  useEffect(() => {
    for(const key in initialized) {
      if(!initialized[key]) return;
    }
    getPuzzle();
    sendPopUpBoard(gameData.info.header,gameData.info.description,gameData.info.button);
  },[initialized])

  useEffect(() => {
    if ((gameData !== null) && (initialized.gameData === false)) setInitialized(current => {
      return {...current,
      gameData: true
    }
    })
  })

  if(puzzle === null) return <h1>Loading!</h1>

  return (
    <>
    <Message text={messageData.text} display={messageData.display}/>
    <PopUpBoard data={popUpBoardData} setData={setPopUpBoardData}/>
      <div className="App" style={ { pointerEvents: popUpBoardData.appClick, filter: popUpBoardData.appFilter}}>
        <header>
          <nav>
            <h1>Lexico</h1>
            <NavLink to="/puzzle">Play!</NavLink>
            <NavLink to="/shop">Upgrade!</NavLink>
            <NavLink to="/leaderboard">Rank!</NavLink>
            <a onClick={() => sendPopUpBoard(gameData.info.header,gameData.info.description,gameData.info.button)}>Help!</a>
          </nav>
          <div id="header-details">
            <p>Your Stats ??</p>
            <p>{`Points: ${userData.points.net}`}</p>
            <p>{`Total Game Time: ${formatDuration(userData.time)}`}</p>
          </div>
        </header>
        <Route exact path="/">
          <Redirect to="/puzzle" />
        </Route>
        <Route exact path="/puzzle">
          <PuzzlePage
          puzzleObj={puzzle}
          handlePuzzleUpdated={updatePuzzle}
          newPuzzle={getPuzzle}
          handleCompleted={puzzleCompleted}
          pageClosed={() => null}
          userData={userData}
          initialized={puzzleInitialized}
          setInitialized={setPuzzleInitialized} />
        </Route>
        <Route path="/shop">
          <ShopPage
          sendMessage={sendMessage} />
        </Route>
        <Route exact path="/leaderboard">
          <LeaderboardPage 
          sendMessage={sendMessage} />
        </Route>
      </div>
    </>
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