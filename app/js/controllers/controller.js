import * as f from '../framework';
import { onClickOutside } from '../on-click-outside';
import { pauseTimer, continueTimer, initTimer, timerOptions } from '../timer';

import {
  GAME_LOADING_TIMEOUT,
  DIFFICULTY_PROPERTIES,
  APP_LOADING_TIMEOUT,
  CARD_BACK_IMAGES,
  RED,
  TOGGLE_NAVIGATION_TIMEOUT,
  RESTART_GAME_TIMEOUT,
  EASY,
} from '../constants';
import { UIController } from './ui-controller';
import { gameController } from './game-controller';

export const controller = ((gameCtrl, UICtrl) => {
  const DOM = UICtrl.getDOMElements();

  const togglePreLoader = () => {
    f.listenEvent(document, 'DOMContentLoaded', () => {
      DOM.body.style.overflow = 'hidden';
      DOM.appLoader.classList.remove('hidden');

      setTimeout(() => {
        DOM.body.style.overflow = 'auto';
        DOM.appLoader.classList.add('hidden');
      }, APP_LOADING_TIMEOUT);
    });
  };

  const chooseDifficulty = ({ target }) => {
    const selectedDifficulty = target.value;

    gameCtrl.setGameDifficulty(selectedDifficulty);

    DOM.difficultyDropdownLabel.textContent =
      DIFFICULTY_PROPERTIES[selectedDifficulty].label;
  };

  const chooseSkirt = ({ target }) => {
    gameCtrl.setCardsSkirt(target.value);

    DOM.dropdownSkirtLabel.src = CARD_BACK_IMAGES[target.value];
  };

  const playPauseGame = ({ target }) => {
    const { checked } = target;

    DOM.backDrop.classList.toggle('hidden');
    DOM.playPauseLabel.textContent = checked ? 'Continue' : 'Pause';

    return checked ? pauseTimer() : continueTimer();
  };

  const updateDropdownLabels = () => {
    const stateObj = gameCtrl.getGameState();

    DOM.dropdownSkirtLabel.src = stateObj.cardBack;
    DOM.difficultyDropdownLabel.textContent = stateObj.difficulty;
  };

  const startGame = () => {
    const state = gameCtrl.getGameState();

    gameCtrl.setGameCards();
    gameCtrl.setMaxAllowedClicks();

    const TOTAL_TIME = DIFFICULTY_PROPERTIES[state.difficulty].time;
    const gridColumnsLength = gameCtrl.getTableGridColumnsNumber();

    setTimeout(() => {
      UICtrl.drawMaxAvailableClicks(state.maxAllowableClicks);
      UICtrl.setGridLayout(gridColumnsLength);
      UICtrl.toggleControlsOnGameStart();
    }, TOGGLE_NAVIGATION_TIMEOUT);
    setTimeout(() => {
      initTimer(TOTAL_TIME);
      UICtrl.drawCards(state.images, state.cardBack);
      UICtrl.toggleControlsOnLevelLoading();
    }, GAME_LOADING_TIMEOUT);
  };

  const restartGame = timeout => {
    DOM.appLoader.classList.remove('hidden');
    f.findByQuery('.spinner').style.display = 'none';

    setTimeout(() => {
      window.location.reload();
    }, timeout);
  };

  const checkGameOver = () => {
    const totalMatches = gameCtrl.getTotalMatches();
    const totalCardPairsLength = gameCtrl.getTotalCardPairsLength();

    if (totalMatches === totalCardPairsLength - 1) {
      pauseTimer();
      const gameTotalTimeObj = gameCtrl.getTotalTime();
      const totalClicks = gameCtrl.getTotalClicks();
      const state = gameCtrl.getGameState();
      const { maxAllowableClicks } = state;

      UICtrl.showFinalScreen(
        timerOptions.seconds,
        totalClicks,
        maxAllowableClicks,
        gameTotalTimeObj
      );
    }
  };

  const handleCardClick = ({ target }) => {
    const card = target.parentNode.parentNode.parentNode;
    const cardId = card.id;
    const cardValue = card.getAttribute('data-card-front');
    checkGameOver();

    if (cardValue) {
      gameCtrl.toggleCards(cardId, cardValue);

      const totalClicks = gameCtrl.getTotalClicks();
      UICtrl.drawTotalClicks(totalClicks);
    }
  };

  const setEventListeners = () => {
    f.listenEventAll(DOM.difficultyRadio, 'change', chooseDifficulty);
    f.listenEventAll(DOM.cardBackRadio, 'change', chooseSkirt);
    f.listenEvent(DOM.startGameButton, 'click', startGame);
    f.listenEvent(DOM.playPause, 'change', playPauseGame);
    f.listenEvent(DOM.tryAgainButton, 'click', () =>
      restartGame(RESTART_GAME_TIMEOUT)
    );
    f.listenEvent(DOM.newGameButton, 'click', () =>
      restartGame(RESTART_GAME_TIMEOUT)
    );
    f.listenEvent(DOM.cardBoard, 'mouseup', handleCardClick);
  };

  return {
    init: () => {
      gameCtrl.setDefaultGameState({
        difficulty: EASY,
        cardBack: CARD_BACK_IMAGES[RED],
      });
      togglePreLoader();
      onClickOutside(DOM.dropdowns);
      updateDropdownLabels();
      setEventListeners();
    },
  };
})(gameController, UIController);
