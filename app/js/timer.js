import * as f from './framework';

export const timerOptions = {
  minutes: 0,
  seconds: 0,
};

let timeInterval;
let t = 0;

const calculateTime = (id, endTime) => {
  const updateTimer = () => {
    t = Date.parse(endTime) - Date.parse(new Date());
    timerOptions.minutes = Math.floor((t / 1000 / 60) % 60);
    timerOptions.seconds = Math.floor((t / 1000) % 60);

    f.findByQuery('.minutes').innerHTML = `${timerOptions.minutes}`;
    f.findByQuery('.seconds').innerHTML = `${timerOptions.seconds}`;

    if (t === 0) {
      clearInterval(timeInterval);
    }
  };

  updateTimer();

  timeInterval = setInterval(updateTimer, 1000);
};

export const continueTimer = () => {
  const continuedDeadLine = new Date(Date.parse(new Date()) + t);

  if (timerOptions.seconds > 0) {
    calculateTime('timer', continuedDeadLine);
  }
};

export const pauseTimer = () => {
  clearInterval(timeInterval);
};

export const initTimer = seconds => {
  const deadLine = new Date(Date.parse(new Date()) + seconds * 1000);

  calculateTime('timer', deadLine);
};
