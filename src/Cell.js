import React from 'react';

const validity = (address, NO_ADDRESS) => {
  if (address === NO_ADDRESS) {
    return 'valid';
  } else {
    return 'invalid';
  }
};

const state = (active) => {
  if (active) {
    return 'active';
  } else {
    return 'inactive';
  }
};

const mark = (address, accounts) => {
  if (address === accounts[0]) {
    return 'X';
  } else if (address === accounts[1]) {
    return 'O';
  } else {
    return '';
  }
};

const Cell = ({
                active,
                address,
                accounts,
                noAddress: NO_ADDRESS,
                onPlaceMark
              }) => (
  <div
    className={`Cell no-select ${validity(address, NO_ADDRESS)} ${state(active)}`}
    onClick={() => onPlaceMark()}
  >
    {mark(address, accounts)}
  </div>
);

export default Cell;
