import * as f from '../framework';
import { timerOptions } from '../timer';

import { CARD_BACK_IMAGES, DIFFICULTY_PROPERTIES } from '../constants';
import { CARD_IMAGES } from '../cards';
import { convertSecondsToTime, convertTimeToSeconds } from '../helpers';

export const gameController = (() => {
  const gameState = {
    difficulty: null,
    images: [],
    cardBack: null,
    maxAllowableClicks: null,
  };

  const cardState = {
    id: null,
    value: null,
    inUse: false,
    totalMatches: 0,
    totalClicks: 0,
  };

  const shuffleCards = a => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const prepareCards = (images, total) => {
    const aHalfOfCards = images.slice(0, total / 2);

    gameState.images = shuffleCards([...aHalfOfCards, ...aHalfOfCards]);
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
    cardState.id = id;
    cardState.value = value;
  };

  const isCardMatch = value => cardState.value === value;

  const resetSelectedCard = () => {
    cardState.id = null;
    cardState.value = null;
    cardState.inUse = false;
  };

  const openCard = id => {
    f.findById(id).classList.add('rotateCardNow');
  };

  const closeCard = id => {
    f.findById(id).classList.remove('rotateCardNow');
  };

  return {
    setMaxAllowedClicks: () => {
      gameState.maxAllowableClicks = gameState.images.length * 2 + 10;
    },
    setDefaultGameState: obj => {
      gameState.difficulty = obj.difficulty;
      gameState.images = obj.images;
      gameState.cardBack = obj.cardBack;
      gameState.maxAllowableClicks = obj.maxAllowableClicks;
    },
    setGameDifficulty: selectedDifficulty => {
      gameState.difficulty = selectedDifficulty;
    },
    setGameCards: () => {
      const totalCards = DIFFICULTY_PROPERTIES[gameState.difficulty].cardsTotal;

      prepareCards(CARD_IMAGES, totalCards);
    },
    getTableGridColumnsNumber: () => {
      const totalCards = DIFFICULTY_PROPERTIES[gameState.difficulty].cardsTotal;

      let colsNumber;

      if (totalCards === 24) {
        colsNumber = 8;
      } else if (totalCards === 18) {
        colsNumber = 6;
      } else {
        colsNumber = 5;
      }

      return `repeat(${colsNumber}, 1fr)`;
    },
    getTableImagesData: () => {
      return {
        images: gameState.images,
        cardBack: gameState.cardBack,
      };
    },
    setCardsSkirt: selectedSkirt => {
      gameState.cardBack = CARD_BACK_IMAGES[selectedSkirt];
    },
    setCardsImages: selectedDifficulty => {
      gameState.images = CARD_BACK_IMAGES[selectedDifficulty];
    },
    getGameState: () => gameState,
    getTotalClicks: () => cardState.totalClicks,
    getTotalMatches: () => cardState.totalMatches,
    getTotalCardPairsLength: () => gameState.images.length / 2,
    toggleCards: (id, value) => {
      ++cardState.totalClicks;

      if (cardState.inUse) return;
      openCard(id);

      if (cardState.id === null) {
        insertFirstCard(id, value);
        return;
      }

      if (cardState.id !== id) {
        cardState.inUse = true;
        setTimeout(() => {
          if (isCardMatch(value)) {
            ++cardState.totalMatches;
            removeMatchedPair(id, cardState.id);
          } else {
            closeCard(cardState.id);
            closeCard(id);
          }
          resetSelectedCard();
        }, 800);
      }
    },
    getTotalTime: () => {
      const defaultTotalSeconds =
        DIFFICULTY_PROPERTIES[gameState.difficulty].time;

      const totalSeconds =
        defaultTotalSeconds -
        convertTimeToSeconds(timerOptions.minutes, timerOptions.seconds);

      return convertSecondsToTime(totalSeconds);
    },
  };
})();
