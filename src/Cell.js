import React from 'react';

const Cell = ({ address, player1, player2, noAddress, onPlaceMark }) => {
  const status = address === noAddress ? 'valid' : 'invalid';
  return (
    <div className={`Cell noselect ${status}`} onClick={() => onPlaceMark()}>
      {address === player1 ? 'X' : address === player2 ? 'O' : ''}
    </div>
  );
};

export default Cell;
