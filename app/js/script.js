import * as f from './framework';
import { pauseTimer, continueTimer, drawTimer, timerOptions } from './timer';

import {
  EASY,
  MEDIUM,
  HARD,
  APP_LOADING_TIMEOUT,
  GAME_LOADING_TIMEOUT,
  RESTART_GAME_TIMEOUT,
} from './constants';
import '../scss/main.scss';
import blueBack from '../img/cards/back/blue_back.webp';
import redBack from '../img/cards/back/red_back.webp';
import { cardImages } from './cards';

const appLoader = f.findById('appLoader');
const gameLoader = f.findById('gameLoader');
const playPause = f.findById('playPause');
const playPauseLabel = f.findById('playPauseLabel');
const cardBoard = f.findById('cardBoard');
const startGameButton = f.findById('startGameButton');
const newGameButton = f.findById('newGameButton');
const tryAgainButton = f.findById('tryAgainButton');
const rulesBox = f.findByQuery('.rules-box');
const gameOverBox = f.findByQuery('.game-over-box');
const processControls = f.findByQuery('.process-controls');
const difficultyControls = f.findByQuery('.difficulty-controls');
const newGameControls = f.findByQuery('.new-game-controls');
const timerBox = f.findByQuery('.timer-box');
const counterBox = f.findByQuery('.counter-box');
const backDrop = f.findByQuery('.backdrop');
const difficultyRadio = f.findByName('difficulty');
const cardBackRadio = f.findByName('cardBack');
const dropdowns = f.findAll('.dropdown');

// Dropdowns
f.listenEventAll(dropdowns, 'click', ({ target }) => {
  target.parentNode.classList.toggle('opened');
});

f.listenEvent(document, 'mouseup', ({ target }) => {
  if (!target.parentNode.classList.contains('opened')) {
    dropdowns.forEach(dropdown => dropdown.classList.remove('opened'));
  }
});

const DIFFICULTIES = {
  [EASY]: {
    label: 'Easy',
    cardsTotal: 10,
    time: 60,
  },
  [MEDIUM]: {
    label: 'Medium',
    cardsTotal: 18,
    time: 120,
  },
  [HARD]: {
    label: 'Hard',
    cardsTotal: 24,
    time: 180,
  },
};

// Game state
const state = {
  difficulty: EASY,
  cardsTotal: DIFFICULTIES.EASY.cardsTotal,
  time: DIFFICULTIES.EASY.time,
  images: [],
  cardBack: blueBack,
  maxAllowableClicks: null,
  totalClicks: 0,
  totalMatches: 0,
};

const setMaxAllowedClicks = totalCards => {
  state.maxAllowableClicks = totalCards * 2 + 10;
  f.findByQuery('.max-allowed-clicks').innerText = totalCards * 2 + 10;
};

f.listenEventAll(cardBackRadio, 'change', ({ target }) => {
  const selectedCardBack = target.value === 'blue' ? blueBack : redBack;
  state.cardBack = selectedCardBack;

  f.findByQuery('.dropdown-label-skirt').src = selectedCardBack;
});

const setGameTime = difficulty => {
  state.time = DIFFICULTIES[difficulty].time;
};

f.listenEventAll(difficultyRadio, 'change', ({ target }) => {
  state.cardsTotal = DIFFICULTIES[target.value].cardsTotal;
  setGameTime(target.value);

  f.findByQuery('.dropdown-label-difficulty').textContent =
    DIFFICULTIES[target.value].label;
});

const setBoardGrid = total => {
  let colsNumber;

  if (total === 24) {
    colsNumber = 8;
  } else if (total === 18) {
    colsNumber = 6;
  } else {
    colsNumber = 5;
  }

  cardBoard.style.gridTemplateColumns = `repeat(${colsNumber}, 1fr)`;
};

const shuffleCards = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const prepareAndSetCards = total => {
  const aHalfOfCards = cardImages.slice(0, total / 2);
  state.images = shuffleCards([...aHalfOfCards, ...aHalfOfCards]);
};

const drawCards = shuffledArray => {
  shuffledArray.forEach((currentFront, index) => {
    cardBoard.innerHTML += `
      <div class="card-box">
        <div class="card" id="card_${index}" data-card-front='${currentFront}'>
          <div class="card__side card__side--front">
            <div class="card__picture card__picture--front">
              <img class="imageOfTheCard" src="${state.cardBack}"/>
            </div>
          </div>
          <div class="card__side card__side--back card__side--back-1">
            <div class="card__picture card__picture--back">
              <img class="imageOfTheCard" src="${currentFront}"/>
            </div>
          </div>
        </div>
      </div>
      `;
  });
};

// Start game
f.listenEvent(startGameButton, 'click', () => {
  setMaxAllowedClicks(state.cardsTotal);
  setBoardGrid(state.cardsTotal);
  prepareAndSetCards(state.cardsTotal);
  setTimeout(() => {
    gameLoader.classList.remove('hidden');
    processControls.classList.remove('hidden');
    rulesBox.classList.add('hidden');
    newGameControls.classList.add('hidden');
    difficultyControls.classList.add('hidden');
    drawTimer(state.time);
  }, 600);
  setTimeout(() => {
    drawCards(state.images);
    timerBox.classList.remove('hidden');
    counterBox.classList.remove('hidden');
    gameLoader.classList.add('hidden');
  }, GAME_LOADING_TIMEOUT);
});

const restartGame = timeout => {
  appLoader.classList.remove('hidden');
  f.findByQuery('.spinner').style.display = 'none';

  setTimeout(() => {
    window.location.reload();
  }, timeout);
};

// New game
f.listenEvent(newGameButton, 'click', () => {
  restartGame(RESTART_GAME_TIMEOUT);
});

// Restart game
f.listenEvent(tryAgainButton, 'click', () => {
  restartGame(RESTART_GAME_TIMEOUT);
});

// Play/Pause game
f.listenEvent(playPause, 'change', ({ target }) => {
  const { checked } = target;
  playPauseLabel.textContent = checked ? 'Continue' : 'Pause';

  if (checked) {
    pauseTimer();
    backDrop.classList.remove('hidden');
  } else {
    continueTimer();
    backDrop.classList.add('hidden');
  }
});

const toggleProgressEmojis = totalClicks => {
  const GREAT_GAME_EMOJI = '&#x1F60E;';
  const BAD_GAME_EMOJI = '&#x1F622;';

  return totalClicks <= state.maxAllowableClicks
    ? GREAT_GAME_EMOJI
    : BAD_GAME_EMOJI;
};

const drawEmojiOnCardClicks = totalClicks => {
  f.findByQuery('.progress-icon').innerHTML = toggleProgressEmojis(totalClicks);
};

// Card handlers
const selectedCard = {
  id: null,
  value: null,
  inUse: false,
};

const openCard = id => {
  f.findById(id).classList.add('rotateCardNow');
};

const closeCard = id => {
  f.findById(id).classList.remove('rotateCardNow');
};

const removeMatchedPair = (firstCardId, secondCardId) => {
  const firstMatched = f.findById(firstCardId);
  const secondMatched = f.findById(secondCardId);

  firstMatched.classList.add('hidden');
  secondMatched.classList.add('hidden');

  setTimeout(() => {
    firstMatched.remove();
    secondMatched.remove();
  }, 800);
};

const insertFirstCard = (id, value) => {
  selectedCard.id = id;
  selectedCard.value = value;
};

const isCardMatch = value => selectedCard.value === value;

const resetSelectedCard = () => {
  selectedCard.id = null;
  selectedCard.value = null;
  selectedCard.inUse = false;
};

const checkGameOver = () => {
  const gameOverContent = f.findById('gameOverContent');
  const resultTime =
    timerOptions.minutes !== 0
      ? `${timerOptions.minutes} min ${timerOptions.seconds} sec`
      : `${timerOptions.seconds} sec`;

  const successGameScreen = `
    <h1>Congratulations!</h1>
    
    <span>
      You have finished game with:
      <span class="total-clicks-label">${state.totalClicks} clicks</span>
    </span>
    <span>
      Your total time is:
      <span class="total-time-label">${resultTime}</span>
    </span>
  `;

  const failedGameScreen = `
    <h1>You loose!</h1>
    <span>Time is over...</span>
  `;

  if (state.images.length / 2 === state.totalMatches) {
    pauseTimer();
    gameOverBox.classList.remove('hidden');
    timerBox.classList.add('hidden');
    counterBox.classList.add('hidden');
    gameOverContent.innerHTML =
      timerOptions.seconds === 0 ? failedGameScreen : successGameScreen;
  }
};

const calculateTotalClicks = () => {
  ++state.totalClicks;

  f.findByQuery('.total-clicks').textContent = state.totalClicks;
};

const cardClickHandler = (id, value) => {
  if (selectedCard.inUse) return;
  openCard(id);
  calculateTotalClicks();
  drawEmojiOnCardClicks(state.totalClicks);

  if (selectedCard.id === null) {
    insertFirstCard(id, value);
    return;
  }

  if (selectedCard.id !== id) {
    selectedCard.inUse = true;
    setTimeout(() => {
      if (isCardMatch(value)) {
        ++state.totalMatches;
        removeMatchedPair(id, selectedCard.id);
        checkGameOver();
      } else {
        closeCard(selectedCard.id);
        closeCard(id);
      }
      resetSelectedCard();
    }, 800);
  }
};

f.listenEvent(cardBoard, 'click', event => {
  const card = event.target.parentNode.parentNode.parentNode;
  const cardId = card.id;
  const cardValue = card.getAttribute('data-card-front');

  if (cardValue) {
    cardClickHandler(cardId, cardValue);
  }
});

f.listenEvent(document, 'DOMContentLoaded', () => {
  f.findByQuery('body').style.overflow = 'hidden';
  appLoader.classList.remove('hidden');

  setTimeout(() => {
    f.findByQuery('body').style.overflow = 'auto';
    appLoader.classList.add('hidden');
  }, APP_LOADING_TIMEOUT);
});
