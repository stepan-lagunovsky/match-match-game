export const timerOptions = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export const redrawTimer = () => {
  document.querySelector('.days').innerHTML = timerOptions.days;
  document.querySelector('.hours').innerHTML = timerOptions.hours;
  document.querySelector('.minutes').innerHTML = `0${timerOptions.minutes}`;
  document.querySelector('.seconds').innerHTML = `0${timerOptions.seconds}`;
  document.querySelector('.total-time-label').textContent = `Min: ${
    timerOptions.minutes
  } Sec: ${timerOptions.seconds}`;
};

let timeInterval;
let t = 0;

const initializeClock = (id, endTime) => {
  const updateClock = () => {
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

  updateClock();

  timeInterval = setInterval(updateClock, 1000);
};

export const continueTimer = () => {
  const continuedDeadLine = new Date(Date.parse(new Date()) + t);
  initializeClock('timer', continuedDeadLine);
};

export const pauseTimer = () => {
  clearInterval(timeInterval);
};

export const drawTimer = seconds => {
  const deadLine = new Date(Date.parse(new Date()) + seconds * 1000);

  initializeClock('timer', deadLine);
};
