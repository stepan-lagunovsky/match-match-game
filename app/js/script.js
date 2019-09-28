import '../scss/main.scss';
import blueBack from '../img/cards/back/blue_back.webp';
import redBack from '../img/cards/back/red_back.webp';
import { cardImages } from './cards';
import { timerOptions, pauseTimer, continueTimer, drawTimer } from './timer';

const findByQuery = selector => document.querySelector(selector);
const findAll = selector => document.querySelectorAll(selector);
const findById = id => document.getElementById(id);
const findByName = name => document.getElementsByName(name);
const listenEvent = (target, eventName, fn) =>
  target.addEventListener(eventName, fn);
const listenEventAll = (targets, eventName, fn) =>
  targets.forEach(target => {
    listenEvent(target, eventName, fn);
  });

const appLoader = findById('appLoader');
const gameLoader = findById('gameLoader');
const playPause = findById('playPause');
const playPauseLabel = findById('playPauseLabel');
const cardBoard = findById('cardBoard');
const startGameButton = findById('startGameButton');
const newGameButton = findById('newGameButton');
const tryAgainButton = findById('tryAgainButton');
const rulesBox = findByQuery('.rules-box');
const gameOverBox = findByQuery('.game-over-box');
const processControls = findByQuery('.process-controls');
const difficultyControls = findByQuery('.difficulty-controls');
const newGameControls = findByQuery('.new-game-controls');
const timerBox = findByQuery('.timer-box');
const counterBox = findByQuery('.counter-box');
const backDrop = findByQuery('.backdrop');
const difficultyRadio = findByName('difficulty');
const cardBackRadio = findByName('cardBack');
const dropdowns = findAll('.dropdown');

const APP_LOADING_TIMEOUT = 5500;

// Dropdowns
listenEventAll(dropdowns, 'click', ({ target }) => {
  target.parentNode.classList.toggle('opened');
});

listenEvent(document, 'mouseup', ({ target }) => {
  if (!target.parentNode.classList.contains('opened')) {
    dropdowns.forEach(dropdown => dropdown.classList.remove('opened'));
  }
});

const EASY = 'EASY';
const MEDIUM = 'MEDIUM';
const HARD = 'HARD';

const DIFFICULTIES = {
  [EASY]: {
    label: 'Easy',
    cardsTotal: 10,
    time: 30,
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
  findByQuery('.max-allowed-clicks').innerText = totalCards * 2 + 10;
};

listenEventAll(cardBackRadio, 'change', ({ target }) => {
  const selectedCardBack = target.value === 'blue' ? blueBack : redBack;
  state.cardBack = selectedCardBack;

  findByQuery('.dropdown-label-skirt').src = selectedCardBack;
});

const setGameTime = difficulty => {
  state.time = DIFFICULTIES[difficulty].time;
};

listenEventAll(difficultyRadio, 'change', ({ target }) => {
  state.cardsTotal = DIFFICULTIES[target.value].cardsTotal;
  setGameTime(target.value);

  findByQuery('.dropdown-label-difficulty').textContent =
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
              <img alt class="imageOfTheCard" src="${state.cardBack}"/>
            </div>
          </div>
          <div class="card__side card__side--back card__side--back-1">
            <div class="card__picture card__picture--back">
              <img alt class="imageOfTheCard" src="${currentFront}"/>
            </div>
          </div>
        </div>
      </div>
      `;
  });
};

// Start game
listenEvent(startGameButton, 'click', () => {
  drawTimer(state.time);
  setMaxAllowedClicks(state.cardsTotal);
  setBoardGrid(state.cardsTotal);
  prepareAndSetCards(state.cardsTotal);
  setTimeout(() => {
    gameLoader.classList.remove('hidden');
    rulesBox.classList.add('hidden');
    processControls.classList.remove('hidden');
    difficultyControls.classList.add('hidden');
    newGameControls.classList.add('hidden');
  }, 600);
  setTimeout(() => {
    drawCards(state.images);
    timerBox.classList.remove('hidden');
    counterBox.classList.remove('hidden');
    gameLoader.classList.add('hidden');
  }, APP_LOADING_TIMEOUT);
});

// New game
listenEvent(newGameButton, 'click', () => {
  window.location.reload();
});

// Restart game
listenEvent(tryAgainButton, 'click', () => {
  window.location.reload();
});

// Play/Pause game
listenEvent(playPause, 'change', ({ target }) => {
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
  findByQuery('.progress-icon').innerHTML = toggleProgressEmojis(totalClicks);
};

// Card handlers
const selectedCard = {
  id: null,
  value: null,
  inUse: false,
};

const openCard = id => {
  findById(id).classList.add('rotateCardNow');
};

const closeCard = id => {
  findById(id).classList.remove('rotateCardNow');
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
  if (state.images.length / 2 === state.totalMatches) {
    gameOverBox.classList.remove('hidden');
    timerBox.classList.add('hidden');
    counterBox.classList.add('hidden');
    pauseTimer();

    findByQuery('.total-clicks-label').textContent = state.totalClicks;

    // TODO: Create getTime method
    findByQuery('.total-time-label').textContent = timerOptions.total;
  }
};

const calculateTotalClicks = () => {
  ++state.totalClicks;

  findByQuery('.total-clicks').textContent = state.totalClicks;
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
        findById(id).remove();
        findById(selectedCard.id).remove();
        checkGameOver();
      } else {
        closeCard(selectedCard.id);
        closeCard(id);
      }
      resetSelectedCard();
    }, 800);
  }
};

listenEvent(cardBoard, 'click', event => {
  const card = event.target.parentNode.parentNode.parentNode;
  const cardId = card.id;
  const cardValue = card.getAttribute('data-card-front');

  if (cardValue) {
    cardClickHandler(cardId, cardValue);
  }
});

listenEvent(document, 'DOMContentLoaded', () => {
  findByQuery('body').style.overflow = 'hidden';
  appLoader.classList.remove('hidden');

  setTimeout(() => {
    findByQuery('body').style.overflow = 'auto';
    appLoader.classList.add('hidden');
  }, APP_LOADING_TIMEOUT);
});
