export const APP_LOADING_TIMEOUT = 5500;
export const GAME_LOADING_TIMEOUT = 5500;
export const RESTART_GAME_TIMEOUT = 400;

const EASY = 'EASY';
const MEDIUM = 'MEDIUM';
const HARD = 'HARD';

export const DIFFICULTIES = {
  EASY,
  MEDIUM,
  HARD,
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
