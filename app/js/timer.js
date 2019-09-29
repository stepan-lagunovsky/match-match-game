import * as f from './framework';

export const timerOptions = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const redrawTimer = () => {
  f.findByQuery('.days').innerHTML = timerOptions.days;
  f.findByQuery('.hours').innerHTML = timerOptions.hours;
  f.findByQuery('.minutes').innerHTML = `0${timerOptions.minutes}`;
  f.findByQuery('.seconds').innerHTML = `0${timerOptions.seconds}`;
};

let timeInterval;
let t = 0;

const calculateTime = (id, endTime) => {
  const updateTimer = () => {
    t = Date.parse(endTime) - Date.parse(new Date());
    timerOptions.days = Math.floor(t / (1000 * 60 * 60 * 24));
    timerOptions.hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    timerOptions.minutes = Math.floor((t / 1000 / 60) % 60);
    timerOptions.seconds = Math.floor((t / 1000) % 60);

    redrawTimer();

    if (t === 0) {
      clearInterval(timeInterval);
    }
  };

  updateTimer();

  timeInterval = setInterval(updateTimer, 1000);
};

export const continueTimer = () => {
  const continuedDeadLine = new Date(Date.parse(new Date()) + t);
  calculateTime('timer', continuedDeadLine);
};

export const pauseTimer = () => {
  clearInterval(timeInterval);
};

export const drawTimer = seconds => {
  const deadLine = new Date(Date.parse(new Date()) + seconds * 1000);

  calculateTime('timer', deadLine);
};
