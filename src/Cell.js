import React from 'react';

const resolveSymbol = (address, player1, player2) => {
  if (address === player1) {
    return 'X';
  } else if (address === player2) {
    return 'O';
  } else {
    return '';
  }
};

const Cell = ({ address, player1, player2, noAddress, onPlaceMark }) => {
  const status = address === noAddress ? 'valid' : 'invalid';
  return (
    <div
      className={`Cell noselect ${status}`}
      onClick={() => onPlaceMark()}
    >
      {resolveSymbol(address, player1, player2)}
    </div>
  );
};

export default Cell;
