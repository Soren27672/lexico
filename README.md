# Lexico

Lexico is a word guessing game similar to Hangman and Wheel of Fortune, with the additional features of progression and ranking.

Completing puzzles awards a user with points, which can be spent purchasing and upgrading bonuses that have unique ways of increasing puzzle point rewards. Users can also view a leaderboard and submit their stats to it.

# Technical

Lexico is built with React and React Router v5

The website hosts three main pages--being the puzzle, shop and leaderboard--each within their own route

In regards to the puzzle page, it is responsible for running the game itself--responding to user input to update the puzzle's progress and the information displayed on-screen--with a puzzle object provided to it by its parent. Within its functionality, it hosts several points of export where the progress data it has generated may be provided to its parent.

The shop page provides the user with an interface to purchase upgrades. It takes the form of a list/detail layout using nested routes. It updates the screen and user progress data in response to input.

The leaderboard page retrieves data from Lexico's server for display, as well as providing a controlled form which the client can use to submit their progress data to the server.

These three page components are held in the App component, which contains the header and navigation. It is also App's \*ideal responsibility to hold and update the user's progress data. For instance, the user's current puzzle is held in state in App and is *provided* to PuzzlePage, as opposed to it being *held* in PuzzlePage itself, which is a component that is meant to run the game, *not* to contain data about any specific instance *of* the game's run.

\* I say ideal because in Lexico as it stands, the userData and gameData state is held in a react context in an external file--not in App. This context is provided to the entire app, so when PuzzlePage and ShopPage need to read gameData or udpate userData, their access is through context, rather than a prop they receive. With more time, I would refactor the code so that either:
    a. The context globalContext is moved into App (So that the context is created by App and provided to all its children) or
    b. userData and gameData are held in App and provided to its children via props
in accordance with the idea that App is the location where user data and "set up" data (such as gameData and the current puzzle) is stored