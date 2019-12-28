import React, { useState } from 'react';
import './App.css';

function App() {
  return (
    <StarMatch />
  );
}

const StarMatch = () => {
  const [stars, setStars] = useState(utils.random(1,9));
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          <StarsDisplay count={stars} />
        </div>
        <div className="right">
          {utils.range(1,9).map(number => 
            <PlayNumber key={number} number={number} />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
    </div>
  );
};

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId =>
      <div key={starId} className="star" /> 
    )}
  </>
);

const PlayNumber = props => (
<button className="number" onClick={() => console.log('Num', props.number)}>
  {props.number}
</button>
);

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoreal',
  condidate: 'deepskyblue',
};

const utils = {
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  range: (min, max) => Array.from({ length: max - min + 1}, (_, i) => min + i),

  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i=0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }

    return sums[utils.random(0, sums.length - 1)];
  },
};

export default App;
