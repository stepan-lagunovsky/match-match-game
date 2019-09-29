export const convertTimeToSeconds = (min, sec) => min * 60 + sec;

export const convertSecondsToTime = sec => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec - minutes * 60;

  return {
    minutes,
    seconds,
  };
};
