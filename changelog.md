# Changelog


### 30
- Updated puzzle initializing process so that it stores the number of Lucky Letter bonuses in puzzleData object
    - calculateFinalValue no longer determines the number of Lucky Letter bonuses itself, but refers to the number stored in puzzleData
- Value component now has a div to contain information about the number and value of Lucky Letter bonuses

- Reworked sendMessage function
    - Previously, the Message component was rendered conditionally based on whether or not messageData was null. Now, Message is always rendered, but its CSS display property is manipulated to show or hide the element
    - The Message component now receives a display prop, which it passes to its outermost div's display property within the object provided to its style attribute
    - sendMessage now updates messageData's display property to "flex" upon being invoked and later resets it to "none" upon its timeout's expiration (previously it replaced the data object with null)

- Created PopUpBoard, which is designed to display important text to the user, darkening and disabling the rest of the web-app until its closer button has been pressed
    - PopUpBoard expects a data object that provides values for header, text, button and display, the first three of which are used by PopUpBoard to determine the text to be displayed in each of those areas, and the last--display--is used to set the PopUpBoard's div's CSS display property to an appropriate value (flex or none)
    - Data regarding the state of PopUpBoard is held in state in App, and is designed to contain values for header, text, button, display, appClick and appFilter
    - When the new function sendPopUpBoard(1,2,3) is called, the popUpBoardData's header, text and button properties are updated with the three args provided to the function. popUpBoardData's display, appClick and appFilter properties are updated to "flex", "none" and "brightness(0.75)" respectively
    - The div within App that contains the entire web-app (except for Message and PopUpBoard) now references popUpBoardData to set its "pointer-events" and "filter" CSS properties (setting them to popUpBoardData.appClick and popUpBoardData.appFilter respectively)
    - Upon clicking the button in PopUpBoard, its onClick attribute calls a setter function provided as a prop to set popUpBoardData's display, appClick and appFilter properties back to "flex", "auto" and "none"

- getRankings now sorts rankings by their point generation rate (points / time) where it previously sorted them by their total points
    - Adjusted Rank to display the rate text before the total points text to clarify what was the ranking was based on

- LeaderboardPage now displays a champion based on the name at the 0 index of rankingData
- Fixed improper date formatting in postScore
    - masks.date was set to "d/m/yy" instead of "m/d/yy"
- Fixed bug where multiple Rapid Inputs could be registered between renders, allowing a user to exceed the maximum of 5
    - calculateFinalValue now multiplies the user's Rapid Input reward by the min value of rapidInputs and 5
- Removed development console.logs
- Styled LeaderboardPage, ShopPage and updated styling on PuzzlePage


### 29
- Upon initializing a puzzle, the user's lifesavers level is stored in the puzzleData object
    - calculateFinalValue now uses the lifesavers number stored in puzzleData where it previously used the lifesavers level stored in userData
- The Strikes component now conditionally renders its elements based on whether or not any incorrect guesses have been made
- Styled PuzzlePage
    - Introduced several functionally insignificant divs in many locations


### 28
- Created Message component that takes a text prop and returns a message-class div containing a \<p\> with the provided text
    - This Message component is conditionally rendered by App based on whether or not the new stateful variable ```messageData``` is null
    - App's state ```messageData.text``` is provided to Message as a text prop
    - A new function sendMessage in App takes args for text and duration, clears the previous timeout stored in messageData, and then creates a new timeout which sets messageData to null upon expiration. After starting the timeout, messageData is set to an object containing the provided text and the id for the newly created timeout
    - sendMessage is provided as a prop to LeaderboardPage, ShopPage and ShopHighlight so that they can send messages to the user when appropriate


### 27
- Moved rankings fetch request to its own function getRankings()
    - getRankings now sorts its response by points high to low
- LeaderboardPage now has a form where you can enter a name and submit your score to the database
    - Created controlled form containing one text input stored under formName in LeaderboardPage
    - Upon the form submitting, it calls the new function postScore, which accepts arguments for name, points, time and event. The form first checks that the name arg is not '' and that the points and time args are not 0. If the args match those values, it logs an error and returns the function
    - If the args pass the checks, the function sends a POST request to the rankings in the server with an object containing the three args (e is just used to run e.preventDefault())
    - Upon the request fulfilling, the component calls getRankings so that the newly posted score is displayed


### 26
- Created Rank component which takes a userObj containing a name, time and points property, then creates a div that displays that information as well as a points per minute
    - Added round-to package
- Added rankings property to the server at the top level
    - rankings is an array of user objects containing a name, time and points property
- LeaderboardPage now fetches to the backend at "rankings" and stores the response in state
    - Once the fetch fulfills, the component iterates thru the rankings and creates a Rank component for the first 50 in the list as well as one for the current userData, given the name 'You'


### 25
- Fixed bug in globalContext that assigned the wrong letter to correctLuckyLetter
    - Added "None" to the beginning of the sequence held in the server so that sequence\[level\] properly correlated with index of the letter in the sequence
- Buttons shown on ShopHighlight now read 'Purchase', 'Upgrade' and 'Maxed Out' appropriately
    - Assigns a string to the variable buttonText: 'Purchase' when the user's bonus's level is 0, 'Upgrade' when it's between 0 and the bonus's limit, and 'Maxed Out' otherwise
- The text that displays the nextValue after the upgrade button now has a bonus-based unit added on
    - Units are stored in the server's gameData as an object containing singular and plural properties
    - When nextValue is 1, unit.singular is appended, otherwise, unit.plural is
- This text is now conditionally rendered so long as the user's bonus's level is less than the limit


### 24
- Added nested routes to ShopPage
    - Added a route to ShopPage that creates a url parameter :bonus which, upon matching, loads the ShopHighlight
    - ShopHighlight accesses the url parameter with useParams, and accesses gameData.bonusData at the provided url parameter to load information about the correct bonus
- The returned JSX of the Thumbnail component is now wrapped in a NavLink that links to the respective bonus's shop highlight url
- ShopHighlight and Thumbnail now both add '/' before their image filenames so that they can more reliably access the files


### 23
- Updated Rapid Input to only affect the first five correct guesses
    - Before checking if rapidInputTimeout is not null, the program initializes a variable amountOfCorrectGuesses, which it then increments for each key in the puzzleData.guesses object whose value is true
    - The program then checks that this value is less than 6 before incrementing puzzleData.rapidInputs
- globalContext now checks if values in its userData object that are dependent on other values are their correct values every time userData updates
    - Calculates what points.net should be (points.gross - points.spent)
    - Calculates what userData.bonusData\[2(Rapid Input)\].reward should be based on the user's Rapid Input level and the server's recursion data for Rapid Input
    - Determines what userData.bonusData\[0(Lucky Letter)\].letter should be based on the user's Lucky Letter level and the server's sequence data for Lucky Letter


### 22
- Added alt props for images
- Changed strike penalty to 20% of final points
    - calculateFinalValue's previous strike calculation was replaced, now it multiplies its returnValue by 1 - the strike value times the number of strikes
    - Strike's valueData is now 0.2 in db.json
- Implemented Rapid Input bonus
    - Upon guessing a correct letter, if the user has purchased Rapid Input, a 2 second timeout is started and it's id is stored in state under rapidInputTimeout. When the timeout expires, rapidInputTimeout is set to null
    - Upon guessing a letter (before creating the timeout), the program checks if rapidInputTimeout is not null, and if it isn't, it calls clearTimeout on rapidInputTimeout and increments puzzleData.rapidInputs by 1


### 21
- The calculateFinalValue function now properly accounts for the user's Lifesaver level and Lucky Letter when calculating the puzzle's final value
    - If the user has unlocked Lucky Letter, then calculateFinalValue will iterate thru all letters in the array property of its provided puzzle object and increment the function's returnValue by Lucky Letter's value in gameData for each letter that matches the user's Lucky Letter
    - If the user has more strikes than lifesavers, then the function's returnValue will be multiplied by gameData.valueData.strike to the power of the difference between strikes and lifesavers
- When PuzzlePage initializes a puzzleObj, it now reveals the player's Lucky Letter




### 20
- ShopHighlight now destructures its bonus prop into its several properties
    - Previously, it accessed the property values with ```bonus.``` every time
- Created function handleUpgradeClick, which checks if userData.points.net is greater than or equal to upgradePrice and then runs appropriate code
    - If true, it updates userData to increment the respective bonus's level by one and increase points.spent by upgradePrice
    - If false, it console.logs 'Insufficient funds'
- Added a useEffect in globalContext dependent on userData that checks if price.net equals price.gross - price.spent, and then updates price.net if not


### 19
- ShopHighlight now displays the proper upgrade cost and next bonus value
    - Calculates upgrade cost by mulitplying the base upgrade cost by the growth rate raised to the power of the current bonus's level
    - Determines next bonus value based on the progression type of the bonus, which is held in gameData
    - If the progression value is "sequence", the nextValue is determined by accessing the bonus's sequence at the index one greater than the current level of the user's bonus
    - If the progression value is "increment", the nextValue is determined by adding one to the user's bonus level
    -If the progression value is "recursive", the nextValue is calculated by mulitplying the bonus's recursion.base by its recursion.growthRate raised to the power of the user's bonus level


### 18
- Thumbnail now properly accesses userData based on the bonus it is passed
- Added bonus images to the project directory and their paths to the backend
    - Thumbnail now loads bonus's image
- Clicking on the thumbnails rendered by the ShopPage component now opens a ShopHighlight, which displays more information about the bonus and will eventually provide an interface to upgrade the bonus


### 17
- Added bonusData to the gameData object in the backend
    - bonusData is an array that contains all information needed to implement and upgrade bonuses
    - Each element of the array is a bonus object that includes the details its name, description, property to be accessed for display on a thumbnail, base price and price growth rate, progression type, sequence (for bonuses that upgrade in a sequence), and recursion data (for bonuses that update recursively)
- Moved userData into gameDataContext for the same reason that gameData is provided via context
    - Renamed gameDataContext to globalContext
    - globalContext also contains the setState function setUserData for components that need to change userData
- Thumbnail now takes a bonus as its prop and displays some game data about that bonus, as well as a space to display some user data about that bonus
    - Thumbnails are now added to PuzzlePage via iteration and include a key prop :)


### 16
- Moved gameData object into its own essentially global context so that it can be accessed without needing to be passed down, since many components will need gameData
- Changed detection of the initialization of the gameData object
    - The fetch is no longer in the App component, so updating ```initialized``` state upon the fulfillment of the promise can no longer be used to move the initialization forward (previously, a useEffect dependent on ```initialized``` moved the initialization process forward)
    - There is now a useEffect that runs every render and checks for the gameDataContext object to not be null and for initialized.gameData to be false. When these conditions are true, it sets initialized.gameData to true, which triggers the useEffect watching ```initialized``` to check if everything is initialized and subsequently to run getPuzzle()
    - I don't like this solution; I don't like that it checks every render, but I'm not aware of another solution


### 15
- Fixed cleanup function that cleared the sessionInterval
    - The cleanup function used to be part of a useEffect callback which called it before every render, it has been moved to a useEffect callback that calls it when the component is unmounted
    - Any time the interval is cleared, the value of sessionInterval in state is set to null
- PuzzlePage now determines when to start the sessionInterval by checking if the puzzle has been completed, and then checking if there's already an interval saved in state


### 14
- Refactored PuzzlePage so that it handles it has a more logical role for itself
    - Instead of recieving a setter function as a prop to change state of a puzzle object in a different component, it now houses a puzzle object in its own state, which can be accessed by functions passed to it
        - The new prop ```handlePuzzleUpdated``` expects a function and invokes it with PuzzlePage's stateful puzzle object as an argument whenever PuzzlePage's stateful puzzle object is updated
        - This allows PuzzlePage to export the progress/results of its game to its parent without directly modifying an external piece of state that it had to be passed
    - Upon rendering, PuzzlePage is passed a puzzleObj that it uses to create its own stateful puzzle object
        - PuzzlePage only updates its state to match its passed puzzleObj when its ```initialized``` prop is false
        - When the ```initialized``` prop is false, PuzzlePage's state is updated to match the passed puzzleObj, after which it invokes the ```setInitialized``` prop with false as its argument
    - Upon initializing a puzzle, PuzzlePage sets an interval that increments the time property of puzzleData by 1000 every second
        - This interval's id is stored in state and cleared whenver the component is unmounted or a puzzle is completed (need to resume interval when puzzle page is returned to)
    - When a puzzle is completed, PuzzlePage runs App's function ```puzzleCompleted``` which gets passed as a prop to PuzzlePage
        - puzzleCompleted adds the current puzzle's .time value to the user's .time value

### 13
- Puzzle objects now have a finalValue property, which holds the point value of the puzzle after all modifications such as strikes and bonuses have been accounted
- The function calculateFinalValue() is now present in PuzzlePage
    - The function takes a puzzle object and returns the final value of the puzzle after all modifications
    - calculateFinalValue is now called when an incorrect guess is registered, and will be called in the future whenever a new final value needs to be displayed
- Value component now displays intial value, strikes and final value


### 12
- Created userData object in state in App.js
    - Holds data about the user's current points
    - Is set up to hold other data about the user's progression such as purchased upgrades and total time
- PuzzlePage now takes a puzzleCompleted prop, which runs when handleGuess() detects that the puzzle has been completed
    - Currently, it just increments the points by the puzzle's value, but it may need to do more in the future


### 11
- PuzzlePage now conditionally renders a "Next Puzzle" button when puzzleData.completed is true
    - This button's onClick event accepts a callback function passed to the prop ```newPuzzle```
    - Currently, the function getPuzzle() from App.js is passed to newPuzzle


### 10
- handleGuess() now detects if the puzzle has been completely solved, setting the property ```completed``` to true if there are no false values in ```revealed```


### 9
- Created function generateIncorrect() in Strikes.js that takes an object of guesses and returns a string representing the previously guessed incorrect letters


### 8
- Created function generateBlanks() in Blanks.js that takes an array of letters and a revealed array and returns a string of blanks and letters that reflects the provided word and the current correct guesses


### 7
- Added handleGuess() function to PuzzlePage which detects non-letter characters, correct guesses, and incorrect guesses before executing a desired piece of code
    - handleGuess() detects invalid characters by first checking that they are one character long, then by checking that they are not the same uppercase and lowercase, if both tests pass, the program moves on to detecting if the guess was correct or not
    - The program establishes a variable ```correct``` as false and then iterates thru the array of letters in the puzzle, checking if it matches the inputted guess, if so, it sets correct to true
    - After iteration, the program updates the puzzle object. If the guess was correct, it will add the guess to the guesses object at the guessed key with a value of true and also update the revealed array so that the index of the correct letters is set to true. If the guess was incorrect, it will update the guesses object at the guessed key with a value of false and set strikes to the number of false values in the guesses object using a function ```instancesOfValueInObject()```, which is fairly self-explanatory


### 6
- Fixed bug with calculateValue
    - reduce method previously had it's initial value set to the point value of the first letter, which resulted in inaccurate scores
    - initial value is now set to zero
- PuzzlePage's parent div has been given an onKeyDown event and is now automatically focused when the user opens the PuzzlePage
    - This is accomplished by accessing the real DOM element thru useRef and then calling the focus() method on it in a useEffect that runs when the component is first rendered

### 5
- Upon the initial render, App makes two fetch requests, one to retrieve the list of puzzles so that it can create the unusedArray, and a second to retrieve the gameData object
    - It is also desired to retrieve a puzzle upon initially rendering, but in order to retrieve a puzzle and prepare it for its client-side functionality, the program must wait until the gameData object is retrieved, because that is where data such as the value of each letter is stored, which is needed to store the value of the puzzle within the client-side puzzle object
    - (it is not ideal to store the value of the puzzle within the puzzle's object in the backend, because then, the client is no longer capable of manipulating its own game data to create special-case game modifications. It is the server's responsibility to provide puzzles, and it is the client's responsibility to run the game in any manner necessary)
    - This wait is achieved by creating an ```initialized``` state, which is an object that contains several processes as properties and a boolean of whether or not they have run as their values
    - When ```initialized``` is updated, a useEffect callback is run, detecting whether all properties of ```initialized``` are true before fetching the puzzle object
    - Now that the two preconditions have been run, the puzzle object can be properly filled with value data
- Introduced calculateValue(), which takes an array of letters, a base value and a coefficient that normalizes a letter's frequency value between 1 and 57 to the desired point variance between easy and hard puzzles (1-200), and returns the difficulty value of the provided array of letters
- The Value component now displays a puzzle's value


### 4
- Created skeleton for puzzle page which loads dummy components
- Created Thumbnail component which currently just displays the text "thum"


### 3
- Added state to hold an unusedIds array, which holds all ids that have not yet been used so that the app is able to generate a different puzzle on successive games
    - This state is initiated with an empty array, but upon the first render, a useEffect fires which replaces the empty array with an array of all puzzle ids
    - This is generated by mapping the fetched array of puzzles by their id values
- App now has a getPuzzle function, this fetches a puzzle object from the backend and then adds it to a client oriented puzzle object that is prepared to hold data about the user's progress in the puzzle


### 2
- Added a fetch to the backend within App.js, this uses an environmental variable and the useState hook, activating only on the initial render
    - This is how I will be calling for the first puzzle when a user arrives at the page

    
### 1
- Created components PuzzlePage, ShopPage, LeaderboardPage, Blanks, Value and Strikes
- Created basic client-side routes for puzzle, shop and leaderboard pages