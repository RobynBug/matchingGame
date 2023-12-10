const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

//array for matched cards

let matchedItem = JSON.parse(localStorage.getItem("matched"));
let matched = matchedItem;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index!
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    newDiv.addEventListener("click", endGame);
    newDiv.addEventListener("click", updateScore);
    newDiv.addEventListener("click", storeMatched);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// Global variables

//Button variables
const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");

//function to flip card

function cardFlip(currentPick) {
  let color = currentPick.classList[0];

  switch (color) {
    case "red":
      currentPick.setAttribute(
        "style",
        "background-image: url('./assets/red.png'); background-size: cover; border: 12px solid transparent; width: 17%; height: 34vh; outline: 2px solid black; margin: 10px; transition: transform 0.8s; transform: rotateY(180deg); transform-style: preserve-3d;"
      );

      break;
    case "blue":
      currentPick.setAttribute(
        "style",
        "background-image: url('./assets/blue.jpg'); background-size: cover; border: 12px solid transparent; width: 17%; height: 34vh; outline: 2px solid black; margin: 10px; transition: transform 0.8s; transform: rotateY(180deg); transform-style: preserve-3d;"
      );

      break;
    case "green":
      currentPick.setAttribute(
        "style",
        "background-image: url('./assets/green.jpg'); background-size: cover; border: 12px solid transparent; width: 17%; height: 34vh; outline: 2px solid black; margin: 10px; transition: transform 0.8s; transform: rotateY(180deg); transform-style: preserve-3d;"
      );
      break;
    case "orange":
      currentPick.setAttribute(
        "style",
        "background-image: url('./assets/orange.jpg'); background-size: cover; border: 12px solid transparent; width: 17%; height: 34vh; outline: 2px solid black; margin: 10px; transition: transform 0.8s; transform: rotateY(180deg); transform-style: preserve-3d;"
      );
      break;
    case "purple":
      currentPick.setAttribute(
        "style",
        "background-image: url('./assets/purple.jpg'); background-size: cover; border: 12px solid transparent; width: 17%; height: 34vh; outline: 2px solid black; margin: 10px; transition: transform 0.8s; transform: rotateY(180deg); transform-style: preserve-3d;"
      );
      break;
  }
}

//function to unflip card

function unflipCard(lastPick, currentPick) {
  lastPick.removeAttribute("id");
  lastPick.removeAttribute("style");
  lastPick.classList.add("unflipped");

  currentPick.removeAttribute("style");
  currentPick.removeAttribute("id");
  currentPick.classList.add("unflipped");
  flipCount = 0;
  lastPick = undefined;
}

//game end function
function endGame() {
  if (matched.length === 10) {
    gameStatus = false;
  }
}

// lastPick variable
let lastPick;

//flipCount variable
let flipCount = 0;

let gameStatus = undefined;

// TODO: Implement this function!
function handleCardClick(event) {
  let currentPick = event.target;
  let color = currentPick.classList[0];
  if (
    (currentPick && currentPick.id == "pickOne") ||
    currentPick.id == "pickTwo" ||
    gameStatus == false
  ) {
    return;
  } else {
    flipCount++;
    if (flipCount == 1) {
      currentPick.classList.remove("unflipped");
      currentPick.setAttribute("id", "pickOne");
      cardFlip(currentPick);
      lastPick = currentPick;
    } else if (flipCount == 2) {
      currentPick.classList.remove("unflipped");
      currentPick.setAttribute("id", "pickTwo");
      cardFlip(currentPick);
      if (lastPick.className != currentPick.className) {
        setTimeout(() => unflipCard(lastPick, currentPick), 1000);
      } else {
        currentPick.classList.remove("unflipped");
        matched.push(currentPick.classList[0]);
        currentPick.classList.add("matched_card");
        matched.push(lastPick.classList[0]);
        lastPick.classList.add("matched_card");
        flipCount = 0;
      }
    }
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);

//variable for score count
let score = document.querySelector(".matched");

//variable for cards
let memoryCards = document.querySelectorAll("#game div");

//variable for game div
let gameDiv = document.querySelector("#game");

//event listener for start game button
startButton.addEventListener("click", startGame);
startButton.addEventListener("click", storeCards);

//event listener for restart game button
restartButton.addEventListener("click", restartGame);
//event listener to store game
restartButton.addEventListener("click", storeCards);

//event listener to update score
function updateScore() {
  score.innerHTML = `Your Score: ${matched.length}/10`;
}

//save matches to local storage
function storeMatched() {
  if (matched != null) {
    let matchedItems = JSON.stringify(matched);
    localStorage.setItem("matched", matchedItems);
  } else {
    matched = [];
  }
}
//function to restore cards and matched items on load
function restore() {
  gameStatusString = localStorage.getItem("GStatus");
  gameStatus = JSON.parse(gameStatusString);
  if (gameStatus === true) {
    if (localStorage.getItem("cards")) {
      let cardArray = localStorage.getItem("cards");
      let cardDeck = JSON.parse(cardArray);

      //clear previously created divs
      gameContainer.innerHTML = "";
      //create new divs
      createDivsForColors(cardDeck);

      memoryCards = document.querySelectorAll("#game div");
    }
    if (matched != null) {
      //restoring class names
      for (let item of memoryCards) {
        if (!matched.includes(item.classList[0])) {
          item.classList.add("unflipped");
        } else {
          item.classList.add("matched_card");
          cardFlip(item);
        }
      }
    }
  }

  if (localStorage.getItem("matched")) {
    let matchedItems = localStorage.getItem("matched");
    savedMatch = JSON.parse(matchedItems);
  }
}

//function to begin the game
function restartGame(e) {
  let eventId = e.target.id;
  //conditional statement to reset the game
  if (gameStatus == false || gameStatus == true) {
    flipCount = 0;
    localStorage.clear();
    lastPick = undefined;
    //shuffle the cards
    shuffledColors = shuffle(COLORS);
    //clear previously created divs
    gameContainer.innerHTML = "";
    //create new divs for shuffled cards
    createDivsForColors(shuffledColors);
    //reassignment of memory cards to new divs
    memoryCards = document.querySelectorAll("#game div");
    //reasignment of game div to new container
    gameDiv = document.querySelector("#game");
    //clearing of the matched array
    matched = [];
    //adding the unflipped status back to cards
    for (let item of memoryCards) {
      item.classList.add("unflipped");
    }
  }
}

function startGame(e) {
  if (gameStatus != true) {
    flipCount = 0;
    lastPick = undefined;
    for (let item of memoryCards) {
      item.classList.add("unflipped");
    }
  }
  gameStatus = true;
  score.removeAttribute("style", "display");
}

//function to store the div location upon reload
function storeCards() {
  let cardArray = JSON.stringify(shuffledColors);
  localStorage.setItem("cards", cardArray);

  //save game status
  let status = JSON.stringify(gameStatus);
  localStorage.setItem("GStatus", status);
}

//update game status
function updateGameStatus() {
  if (matched == null) {
    gameStatus = undefined;
    let status = JSON.stringify(gameStatus);
    localStorage.setItem("GStatus", status);
  }
}

window.addEventListener("load", restore);
window.addEventListener("load", updateGameStatus);
window.addEventListener("load", updateScore);
