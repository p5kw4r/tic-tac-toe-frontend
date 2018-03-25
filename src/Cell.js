import React from 'react';

const Cell = ({ address, player1, player2, noAddress, onPlaceMarker }) => (
  <div
    className={`Cell ${address === noAddress ? 'valid' : 'invalid'}`}
    onClick={() => onPlaceMarker()}
  >
    {
      address === player1 ? 'X' : address === player2 ? 'O' : ''
    }
  </div>
);

export default Cell;
