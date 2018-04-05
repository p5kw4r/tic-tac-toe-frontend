import React from 'react';

const Cell = ({ address, players, noAddress, onPlaceMark }) => {
  const status = address === noAddress ? 'valid' : 'invalid';
  return (
    <div className={`Cell noselect ${status}`} onClick={() => onPlaceMark()}>
      {address === players[0] ? 'X' : address === players[1] ? 'O' : ''}
    </div>
  );
};

export default Cell;
