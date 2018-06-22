import React from 'react';

const validity = (address, NO_ADDRESS) => {
  return address === NO_ADDRESS ? 'valid' : 'invalid';
};

const state = (active) => {
  return active ? 'active' : 'inactive';
};

const mark = (address, players) => {
  return address === players[0] ? 'X'
    : address === players[1] ? 'O'
      : '';
};

const Cell = ({
  active,
  address,
  players,
  noAddress: NO_ADDRESS,
  onPlaceMark
}) => (
  <td
    className={`Cell no-select ${validity(address, NO_ADDRESS)} ${state(active)}`}
    onClick={() => onPlaceMark()}
  >
    {mark(address, players)}
  </td>
);

export default Cell;
