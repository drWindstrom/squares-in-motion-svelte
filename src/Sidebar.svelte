<script lang="ts">
  import { squares } from './store';

  function getInputValue(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    return Number(inputElement.value);
  }

  let sideLength = 40;
  let numberOfSquares = 100;
  let requestedFps = 30;
  let intervalId: number | undefined;
  let numberSpinning = 0;
  let fpsList: number[] = [];
  let lastFrameFps = 0;

  function handleStartButtonClick() {
    fpsList = [];
    lastFrameFps = 0;
    // Create squares
    squares.create(numberOfSquares, sideLength);
    // Stop spinning squares
    stopSpinningSquares();
    logInput();
    if (numberSpinning > 0) {
      intervalId = setInterval(() => {
        measureFps();
        squares.rotate(numberSpinning);
      }, 1000 / requestedFps);
    }
  }

  function handleStopButtonClick() {
    stopSpinningSquares();
  }

  function average(list: number[], subsetSize = 0) {
    if (list.length === 0 || list.length < subsetSize) {
      return 0;
    }

    const summer = (acc: number, current: number) => acc + current;
    if (subsetSize === 0) {
      const sum = list.reduce(summer);
      return Math.round(sum / list.length);
    } else {
      const lastItems = list.slice(list.length - subsetSize);
      const sum = lastItems.reduce(summer);
      return Math.round(sum / lastItems.length);
    }
  }

  function stopSpinningSquares() {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  let lastT = 0;

  function measureFps() {
    // Check whether this is the first run
    if (lastT === 0) {
      lastT = performance.now();
      return;
    }
    const t = performance.now();
    const diff = t - lastT;
    lastFrameFps = Math.round(1000 / diff);
    fpsList = [...fpsList, lastFrameFps];
    // Save current time stamp for next run
    lastT = t;
  }

  function logInput() {
    console.log(`
    Starting a new run with the following parameters:  
      sideLength: ${sideLength}
      numberOfSquares: ${numberOfSquares} 
      numberSpinning: ${numberSpinning}
      requestedFps: ${requestedFps}
    `);
  }
</script>

<aside>
  <label for="side-length">Side length:</label>
  <input
    type="number"
    id="side-length"
    name="side-length"
    value={sideLength}
    on:change={e => (sideLength = getInputValue(e))}
  />
  <label for="num-squares">Number of squares:</label>
  <input
    type="number"
    id="num-squares"
    name="num-squares"
    value={numberOfSquares}
    on:change={e => (numberOfSquares = getInputValue(e))}
  />
  <label for="num-spinning">Number spinning:</label>
  <input
    type="number"
    id="num-spinning"
    name="num-spinning"
    value={numberSpinning}
    on:change={e => (numberSpinning = getInputValue(e))}
  />
  <label for="req-fps">Frames per sec:</label>
  <input
    type="number"
    id="req-fps"
    name="req-fps"
    value={requestedFps}
    on:change={e => (requestedFps = getInputValue(e))}
  />
  <div>
    <button on:click={handleStartButtonClick}>Start</button>
    <button on:click={handleStopButtonClick}>Stop</button>
  </div>
  <p>Last frame: {lastFrameFps} fps</p>
  <p>Last 30 frames: {average(fpsList, 30)} fps</p>
  <p>All frames: {average(fpsList)} fps</p>
</aside>

<style>
  aside {
    width: 160px;
    height: 100vh;
    padding-left: 10px;
    background-color: #eeeeee;
    display: flex;
    flex-direction: column;
  }

  label {
    margin-top: 12px;
    margin-bottom: 4px;
  }

  input {
    margin-right: 16px;
  }

  button {
    margin-top: 8px;
    margin-right: 8px;
  }
</style>
