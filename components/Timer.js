class Timer {
  constructor(displayElement) {
    this.displayElement = displayElement;
    this.startTime = new Date();
    this.interval = null;
    this.start();
  }

  start() {
    this.interval = setInterval(() => {
      let elapsedTime = Math.floor((new Date() - this.startTime) / 1000);
      let minutes = Math.floor(elapsedTime / 60);
      let seconds = elapsedTime % 60;
      this.displayElement.textContent = `${minutes
        .toString()
        .padStart(2, "0")}m${seconds.toString().padStart(2, "0")}s`;
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }
}

export default Timer;
