document.addEventListener("DOMContentLoaded", () => {
  const buttonSound = new Audio("sounds/button-click.ogg");

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      buttonSound.currentTime = 0; // reset sound
      buttonSound.play();
    });
  });

  const cards = [
    { name: "black", img: "./images/black.jpg" },
    { name: "blue", img: "./images/blue.jpg" },
    { name: "brown", img: "./images/brown.jpg" },
    { name: "green", img: "./images/green.jpg" },
    { name: "orange", img: "./images/orange.jpg" },
    { name: "pink", img: "./images/pink.jpg" },
    { name: "purple", img: "./images/purple.jpg" },
    { name: "red", img: "./images/red.jpg" },
    { name: "white", img: "./images/white.jpg" },
    { name: "yellow", img: "./images/yellow.jpg" },
  ];

  const startButton = document.getElementById("start-button");
  const difficultyButton = document.querySelector(".difficulty-button");
  const easyButton = document.getElementById("easy");
  const mediumButton = document.getElementById("medium");
  const hardButton = document.getElementById("hard");
  const gameBoard = document.querySelector(".game-board");
  const movesCounterElement = document.getElementById("moves-counter");
  const movesContainer = document.getElementById("moves-container");
  const congratsMessage = document.getElementById("finish-message");
  const playAgainButton = document.getElementById("play-again-button");
  const logo = document.querySelector(".logo");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moveCount = 0;
  let difficulty = "";

  startButton.addEventListener("click", () => {
    startButton.classList.toggle("hidden");
    difficultyButton.classList.toggle("hidden");
  });

  easyButton.addEventListener("click", () => {
    startGame(12);
    gameBoard.classList.add("easy");
    difficulty = "easy";
  });

  mediumButton.addEventListener("click", () => {
    startGame(16);
    gameBoard.classList.add("medium");
    difficulty = "medium";
  });

  hardButton.addEventListener("click", () => {
    startGame(20);
    gameBoard.classList.add("hard");
    difficulty = "hard";
  });

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function updateMoveCounter() {
    movesCounterElement.textContent = moveCount;
  }

  function startGame(numberOfCards) {
    moveCount = 0;
    updateMoveCounter();

    difficultyButton.classList.add("hidden");
    gameBoard.classList.remove("hidden");
    movesContainer.classList.remove("hidden");
    gameBoard.innerHTML = "";
    logo.classList.add("minimised");

    const selectedCards = shuffle([...cards]).slice(0, numberOfCards / 2);
    const cardPairs = shuffle([...selectedCards, ...selectedCards]);

    cardPairs.forEach((cardData) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.name = cardData.name;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-back">
            <img src="./images/card-back.jpg" alt="Card Back" />
          </div>
          <div class="card-front">
            <img src="${cardData.img}" alt="${cardData.name}" />
          </div>
        </div>
      `;

      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }

  function flipCard(card) {
    if (
      lockBoard ||
      card.classList.contains("flipped") ||
      card.classList.contains("matched")
    )
      return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      lockBoard = true;

      checkForMatch();
    }
  }

  function checkForMatch() {
    moveCount++;
    updateMoveCounter();

    if (firstCard.dataset.name === secondCard.dataset.name) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      const matchedCards = document.querySelectorAll(".card.matched");
      const totalCards = document.querySelectorAll(".card");

      if (matchedCards.length === totalCards.length) {
        setTimeout(() => {
          endGame();
        }, 1000);
      }

      resetBoard();
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
      }, 1000);
    }
  }

  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function endGame() {
    gameBoard.classList.add("hidden");
    gameBoard.classList.remove("easy");
    gameBoard.classList.remove("medium");
    gameBoard.classList.remove("hard");
    gameBoard.innerHTML = "";
    logo.classList.remove("minimised");
    movesContainer.classList.add("hidden");
    congratsMessage.classList.remove("hidden");

    congratsMessage.textContent = `Congrats! You finished the game in ${moveCount} moves on ${difficulty} mode!`;
    playAgainButton.classList.remove("hidden");

    playAgainButton.addEventListener("click", () => {
      congratsMessage.classList.add("hidden");
      playAgainButton.classList.add("hidden");
      difficultyButton.classList.remove("hidden");
    });
  }
});
