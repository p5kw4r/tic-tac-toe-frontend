import React from 'react';

const Cell = ({ address, accounts, noAddress: NO_ADDRESS, onPlaceMark }) => {
  let state, mark;
  if (address === NO_ADDRESS) {
    state = 'valid';
    mark = '';
  } else {
    state = 'invalid';
    if (address === accounts[0]) {
      mark = 'X';
    } else {
      mark = 'O';
    }
  }
  return (
    <div className={`Cell no-select ${state}`} onClick={() => onPlaceMark()}>
      {mark}
    </div>
  );
};

export default Cell;
