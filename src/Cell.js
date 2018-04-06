import React from 'react';

const Cell = ({ address, accounts, noAddress: NO_ADDRESS, onPlaceMark }) => {
  const status = address === NO_ADDRESS ? 'valid' : 'invalid';
  return (
    <div className={`Cell noselect ${status}`} onClick={() => onPlaceMark()}>
      {address === accounts[0] ? 'X' : address === accounts[1] ? 'O' : ''}
    </div>
  );
};

export default Cell;
