export const timerOptions = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  total: 0,
};

let timeInterval;
let t = 0;

const getTimeRemaining = endTime => {
  t = Date.parse(endTime) - Date.parse(new Date());
  const seconds = Math.floor((t / 1000) % 60);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    days,
    hours,
    minutes,
    seconds,
    total: t,
  };
};

const initializeClock = (id, endTime) => {
  const daysSpan = document.querySelector('.days');
  const hoursSpan = document.querySelector('.hours');
  const minutesSpan = document.querySelector('.minutes');
  const secondsSpan = document.querySelector('.seconds');

  const updateClock = () => {
    const remainingTime = getTimeRemaining(endTime);

    daysSpan.innerHTML = remainingTime.days;
    hoursSpan.innerHTML = `0${remainingTime.hours}`.slice(-2);
    minutesSpan.innerHTML = `0${remainingTime.minutes}`.slice(-2);
    secondsSpan.innerHTML = `0${remainingTime.seconds}`.slice(-2);

    Object.entries(timerOptions).forEach(([key]) => {
      timerOptions[key] = remainingTime[key];
    });

    timerOptions.total = `Min: ${timerOptions.minutes} Sec: ${
      timerOptions.seconds
    }`;

    if (remainingTime.total <= 0) {
      clearInterval(timeInterval);
    }
  };

  updateClock();
  timeInterval = setInterval(updateClock, 1000);
};

export const drawTimer = value => {
  const timeObj = {
    days: 1,
    hours: 0,
    minutes: value / 3600,
    seconds: 1,
  };

  const deadLine = new Date(
    Date.parse(new Date()) +
      timeObj.days * 60 * timeObj.minutes * 60 * timeObj.seconds * 1000
  );

  initializeClock('timer', deadLine);
};

export const pauseTimer = () => {
  clearInterval(timeInterval);
};

export const continueTimer = () => {
  const continuedDeadLine = new Date(Date.parse(new Date()) + t);
  initializeClock('timer', continuedDeadLine);
};
