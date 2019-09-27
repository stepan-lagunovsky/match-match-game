import '../scss/main.scss';
import blueBack from '../img/cards/back/blue_back.png';
import redBack from '../img/cards/back/red_back.png';
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

const dropdowns = findAll('.dropdown');
const playPause = findById('playPause');
const playPauseLabel = findById('playPauseLabel');
const difficultyRadio = findByName('difficulty');
const cardBackRadio = findByName('cardBack');
const cardBoard = findById('cardBoard');
const rulesBox = findByQuery('.rules-box');
const gameOverBox = findByQuery('.game-over-box');
const startGameButton = findById('startGameButton');
const newGameButton = findById('newGameButton');
const tryAgainButton = findById('tryAgainButton');
const processControls = findByQuery('.process-controls');
const difficultyControls = findByQuery('.difficulty-controls');
const newGameControls = findByQuery('.new-game-controls');
const timerBox = findByQuery('.timer-box');
const counterBox = findByQuery('.counter-box');
const backDrop = findByQuery('.backdrop');

listenEvent(newGameButton, 'click', () => {
  window.location.reload();
});

listenEvent(tryAgainButton, 'click', () => {
  window.location.reload();
});

// Dropdowns
listenEventAll(dropdowns, 'click', event => {
  event.target.parentNode.classList.toggle('opened');
});

listenEvent(document, 'mouseup', () => {
  dropdowns.forEach(dropdown => dropdown.classList.remove('opened'));
});

// Game state
const state = {
  cardBack: blueBack,
  cardsTotal: 10,
  images: [],
  maxAllowableClicks: null,
  totalClicks: 0,
  totalMatches: 0,
  time: {
    days: 1,
    hours: 0,
    minutes: 0.25,
    seconds: 1,
  },
};

const setGameTime = totalCards => {
  let difficultyType;

  if (totalCards === '24') {
    difficultyType = 3 / 60;
  } else if (totalCards === '18') {
    difficultyType = 2 / 60;
  } else {
    difficultyType = 0.5 / 60;
  }

  state.time.minutes = difficultyType.toFixed(2);
};

// Play/pause
listenEvent(playPause, 'change', event => {
  const { checked } = event.target;
  playPauseLabel.textContent = checked ? 'Continue' : 'Pause';

  if (checked) {
    pauseTimer();

    backDrop.classList.remove('hidden');
  } else {
    continueTimer();

    backDrop.classList.add('hidden');
  }
});

const setMaxAllowedClicks = totalCards => {
  state.maxAllowableClicks = totalCards * 2 + 10;
  findByQuery('.max-allowed-clicks').innerText = totalCards * 2 + 10;
};

listenEventAll(cardBackRadio, 'change', event => {
  const selectedCardBack = event.target.value === 'blue' ? blueBack : redBack;
  state.cardBack = selectedCardBack;

  findByQuery('.dropdown-label-skirt').src = selectedCardBack;
});

listenEventAll(difficultyRadio, 'change', event => {
  state.cardsTotal = event.target.value;

  const EASY = 10;
  const MEDIUM = 18;
  const HARD = 24;

  const DIFFICULTY_LABELS = {
    [EASY]: 'Easy',
    [MEDIUM]: 'Medium',
    [HARD]: 'Hard',
  };

  findByQuery('.dropdown-label-difficulty').textContent =
    DIFFICULTY_LABELS[event.target.value];
});

const setBoardGrid = total => {
  let colsNumber;

  if (total === '24') {
    colsNumber = 8;
  } else if (total === '18') {
    colsNumber = 6;
  } else {
    colsNumber = 5;
  }

  cardBoard.style.gridTemplateColumns = `repeat(${colsNumber}, 1fr)`;
};

// Shuffle cards
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
  findByQuery('.loader').style.display = 'flex';
  setGameTime(state.cardsTotal);
  drawTimer(state.time);
  setMaxAllowedClicks(state.cardsTotal);
  setBoardGrid(state.cardsTotal);
  prepareAndSetCards(state.cardsTotal);
  newGameControls.classList.add('hidden');
  processControls.classList.remove('hidden');
  difficultyControls.classList.add('hidden');
  rulesBox.classList.add('hidden');
  setTimeout(() => {
    findByQuery('.loader').style.display = 'none';
    drawCards(state.images);
    timerBox.classList.remove('hidden');
    counterBox.classList.remove('hidden');
  }, 800);
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

const openCard = id => {
  findById(id).classList.add('rotateCardNow');
};

const closeCard = id => {
  findById(id).classList.remove('rotateCardNow');
};

const selectedCard = {
  id: null,
  value: null,
  inUse: false,
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
