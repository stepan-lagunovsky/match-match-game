import * as f from '../framework';

export const UIController = (() => {
  const DOMElements = {
    appLoader: f.findById('appLoader'),
    gameLoader: f.findById('gameLoader'),
    playPause: f.findById('playPause'),
    playPauseLabel: f.findById('playPauseLabel'),
    cardBoard: f.findById('cardBoard'),
    startGameButton: f.findById('startGameButton'),
    newGameButton: f.findById('newGameButton'),
    tryAgainButton: f.findById('tryAgainButton'),
    rulesBox: f.findById('rulesBox'),
    gameOverBox: f.findByQuery('.game-over-box'),
    dropdownSkirtLabel: f.findByQuery('.dropdown-label-skirt'),
    difficultyDropdownLabel: f.findByQuery('.dropdown-label-difficulty'),
    processControls: f.findByQuery('.process-controls'),
    controls: f.findByQuery('.controls'),
    timerBox: f.findByQuery('.timer-box'),
    counterBox: f.findByQuery('.counter-box'),
    backDrop: f.findByQuery('.backdrop'),
    body: f.findByQuery('body'),
    difficultyRadio: f.findByName('difficulty'),
    cardBackRadio: f.findByName('cardBack'),
    dropdowns: f.findAll('.dropdown'),
    maxAllowedClicksLabel: f.findByQuery('.max-allowed-clicks'),
    totalClicksLabel: f.findByQuery('.total-clicks'),
    gameOverContent: f.findById('gameOverContent'),
  };

  const drawFinalScreen = (
    seconds,
    totalClicks,
    maxAllowableClicks,
    resultTime
  ) => {
    const resultTimeLabelText =
      resultTime.minutes !== 0
        ? `${resultTime.minutes} min ${resultTime.seconds} sec`
        : `${resultTime.seconds} sec`;

    const failedGameScreenHtml = `
      <h1>You loose!</h1>
      <span>Time is over...</span>
    `;

    const successGameScreenHtml = `
      <h1>Congratulations!</h1>
      <h2>Game statistics</h2>
      <ul>
        <li>
          <span>You have finished game with:</span>
          <span class="total-clicks-label">
            ${totalClicks}
          </span>
          <span>of max available</span>
          <span class="total-clicks-label">
            ${maxAllowableClicks}
          </span>
          <span>clicks</span>
        </li>
        <li>
          <span>Your total time is:</span>
          <span class="total-time-label">${resultTimeLabelText}</span>
        </li>
      </ul>
    `;

    DOMElements.gameOverContent.innerHTML =
      seconds === 0 ? failedGameScreenHtml : successGameScreenHtml;
  };

  return {
    drawTotalClicks: totalClicksCount => {
      DOMElements.totalClicksLabel.textContent = totalClicksCount;
    },
    animateCloseCardRotation: cardId => {
      f.findById(cardId).classList.remove('rotateCardNow');
    },
    getDOMElements: () => {
      return DOMElements;
    },
    showFinalScreen: (seconds, totalClicks, maxAllowableClicks, resultTime) => {
      DOMElements.gameOverBox.classList.remove('hidden');
      DOMElements.timerBox.classList.add('hidden');
      DOMElements.counterBox.classList.add('hidden');
      drawFinalScreen(seconds, totalClicks, maxAllowableClicks, resultTime);
    },
    drawCards: (images, cardBack) => {
      images.forEach((currentFront, index) => {
        DOMElements.cardBoard.innerHTML += `
          <div class="card-box">
            <div class="card" id="card_${index}" data-card-front='${currentFront}'>
              <div class="card__side card__side--front">
                <div class="card__picture card__picture--front">
                  <img class="imageOfTheCard" src="${cardBack}"/>
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
    },
  };
})();
