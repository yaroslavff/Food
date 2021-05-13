function timer(selector, deadline) {
  // Timer

  function getTime(endtime) {
    const t = endtime - new Date();
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((t / (1000 * 60)) % 60);
    const seconds = Math.floor((t / (1000)) % 60);

    return {
      "result": t,
      "days": days,
      "hours": hours,
      "minutes": minutes,
      "seconds": seconds
    };
  }

  function getZero(n) {
    if(n < 10) {
      return `0${n}`;
    } else {
      return n;
    }
  }

  function setTimeInTimer(selector, endtime) {

    const timer = document.querySelector(selector);
    const days = timer.querySelector("#days");
    const hours = timer.querySelector("#hours");
    const minutes = timer.querySelector("#minutes");
    const seconds = timer.querySelector("#seconds");
    const clockInterval = setInterval(updateClock, 1000);

    function updateClock() {
      const t = getTime(endtime);

      if(t.result <= 0) {
        return clearInterval(clockInterval);
      }

      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);
    }

  }

  setTimeInTimer(selector, deadline);
}

export default timer;