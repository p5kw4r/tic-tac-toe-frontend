import React from 'react';

const Cell = ({ address, accounts, noAddress: NO_ADDRESS, onPlaceMark }) => {
  return (
    <div
      className={`Cell no-select ${address === NO_ADDRESS ? 'valid' : 'invalid'}`}
      onClick={() => onPlaceMark()}
    >
      {address === accounts[0] ? 'X' : address === accounts[1] ? 'O' : ''}
    </div>
  );
};

export default Cell;
