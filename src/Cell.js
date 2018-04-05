import React from 'react';

const Cell = ({ address, players, noAddress: NO_ADDRESS, onPlaceMark }) => {
  const status = address === NO_ADDRESS ? 'valid' : 'invalid';
  const classes = `Cell noselect ${status}`;
  return (
    <div className={classes} onClick={() => onPlaceMark()}>
      {address === players[0] ? 'X' : address === players[1] ? 'O' : ''}
    </div>
  );
};

export default Cell;
