import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  return (
    <StarMatch />
  );
}

const Game = (props) => {
  const [stars, setStars] = useState(utils.random(1,9));
  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondLeft, setSecondLeft] = useState(10); 

  useEffect(() => {
    if (secondLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondLeft(secondLeft - 1);
      },1000);
      return () => clearTimeout(timerId);
    }
  });

  const candidateAreWrong = utils.sum(candidateNums) > stars;
  const gameIsDone = availableNums.length === 0;

  const gameStatus = availableNums.length === 0 
    ? 'won'
    : secondLeft === 0 ? 'lost' : 'active';

  const numnberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidateAreWrong ? 'wrong' : 'condidate';
    }
    return 'available';
  }

  const onNumberClick = (number, currentStatus) => {
    //currentStatus => newStatus
    console.log(number, currentStatus);
    if (currentStatus == 'used' || gameStatus !== 'active') {
      return;
    }
    //candidateNums
    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);
        
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1,9).map(number => 
            <PlayNumber
              status={numnberStatus(number)}
              key={number}
              number={number}
              onClick={onNumberClick}
              />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondLeft}</div>
    </div>
  );
};

const StarMatch = () => {
  const [gameId, setGemaeId] = useState(1);
  return <Game key={gameId} startNewGame={() => {
    setGemaeId(gameId + 1);
    console.log("gameId is " + gameId)
  }} />
}

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId =>
      <div key={starId} className="star" /> 
    )}
  </>
);

const PlayAgain = props => (
  <div className='game-done'>
    <div
     className='message'
     style={{color: props.gameStatus === 'lost' ? 'red' : 'green'}}
    >You {props.gameStatus}</div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
)

const PlayNumber = props => (
<button 
  className="number" 
  style={{backgroundColor: colors[props.status] }}
  onClick={() => props.onClick(props.number, props.status)}
  >
  {props.number}
</button>
);

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
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
