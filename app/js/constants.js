import blueBack from '../img/cards/back/blue_back.webp';
import redBack from '../img/cards/back/red_back.webp';

export const APP_LOADING_TIMEOUT = 5500;
export const GAME_LOADING_TIMEOUT = 5500;
export const RESTART_GAME_TIMEOUT = 400;
export const TOGGLE_NAVIGATION_TIMEOUT = 600;

export const EASY = 'EASY';
export const MEDIUM = 'MEDIUM';
export const HARD = 'HARD';

export const RED = 'RED';
export const BLUE = 'BLUE';

export const CARD_BACK_IMAGES = {
  [RED]: redBack,
  [BLUE]: blueBack,
};

export const DIFFICULTY_PROPERTIES = {
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
