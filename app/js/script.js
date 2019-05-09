import '../scss/main.scss';
import blueBack from '../img/cards/back/blue_back.png';
import redBack from '../img/cards/back/red_back.png';
import { cardImages } from './cards';

require('babel-core/register');
require('babel-polyfill');

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
const congratsBox = findByQuery('.congrats-box');
const startGameButton = findById('startGameButton');
const newGameButton = findById('newGameButton');
const processControls = findByQuery('.process-controls');
const difficultyControls = findByQuery('.difficulty-controls');
const newGameControls = findByQuery('.new-game-controls');
const timerBox = findByQuery('.timer-box');
const backDrop = findByQuery('.backdrop');

listenEvent(newGameButton, 'click', () => {
  window.location.reload();
});

// Dropdowns
listenEventAll(dropdowns, 'click', event => {
  event.target.parentNode.classList.toggle('opened');
});

listenEvent(document, 'mouseup', () => {
  dropdowns.forEach(dropdown => dropdown.classList.remove('opened'));
});

// TIMER
let totalSeconds = 0;

function Timer() {
  let timerId;
  let start;
  let remaining;

  this.pause = () => {
    window.clearTimeout(timerId);
    remaining -= Date.now() - start;
  };

  this.resume = () => {
    start = Date.now();
    window.clearTimeout(timerId);
    timerId = window.setInterval(() => {
      ++totalSeconds;

      findById('timer').innerHTML = `${Math.floor(
        (totalSeconds / 1000) * 2.5
      )}`;
    }, remaining);
  };

  this.pause();
}

const timer = new Timer();
timer.resume();

// Play/pause
listenEvent(playPause, 'change', event => {
  const { checked } = event.target;
  playPauseLabel.textContent = checked ? 'Continue' : 'Pause';

  if (checked) {
    timer.pause();
    backDrop.classList.remove('hidden');
  } else {
    timer.resume();
    backDrop.classList.add('hidden');
  }
});

// Game state
const gameOptions = {
  cardBack: blueBack,
  cardsTotal: 10,
  images: [],
};

listenEventAll(cardBackRadio, 'change', event => {
  gameOptions.cardBack = event.target.value === 'blue' ? blueBack : redBack;
});

listenEventAll(difficultyRadio, 'change', event => {
  gameOptions.cardsTotal = event.target.value;
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
  gameOptions.images = shuffleCards([...aHalfOfCards, ...aHalfOfCards]);
};

const drawCards = shuffledArray => {
  shuffledArray.forEach((currentFront, index) => {
    cardBoard.innerHTML += `
      <div class="card-box">
        <div class="card" id="card_${index}" data-card-front='${currentFront}'>
          <div class="card__side card__side--front">
            <div class="card__picture card__picture--front">
              <img alt class="imageOfTheCard" src="${gameOptions.cardBack}"/>
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
  setBoardGrid(gameOptions.cardsTotal);
  prepareAndSetCards(gameOptions.cardsTotal);
  drawCards(gameOptions.images);
  newGameControls.classList.add('hidden');
  processControls.classList.remove('hidden');
  difficultyControls.classList.add('hidden');
  timerBox.classList.remove('hidden');
  rulesBox.classList.add('hidden');
});

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

const cardClickHandler = (id, value) => {
  if (selectedCard.inUse) return;
  openCard(id);

  if (selectedCard.id === null) {
    insertFirstCard(id, value);
    return;
  }

  if (selectedCard.id !== id) {
    selectedCard.inUse = true;
    setTimeout(() => {
      if (isCardMatch(value)) {
        findById(id).remove();
        findById(selectedCard.id).remove();
      } else {
        closeCard(selectedCard.id);
        closeCard(id);
      }
      resetSelectedCard();
    }, 800);
  }
};

listenEvent(cardBoard, 'click', event => {
  const cardId = event.target.parentNode.parentNode.parentNode.id;
  const cardFront = event.target.parentNode.parentNode.parentNode.getAttribute(
    'data-card-front'
  );

  cardClickHandler(cardId, cardFront);
});
