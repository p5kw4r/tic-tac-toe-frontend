import React from 'react';

const resolveValidity = (address, NO_ADDRESS) => {
  if (address === NO_ADDRESS) {
    return 'valid';
  } else {
    return 'invalid';
  }
};

const resolveState = (active) => {
  if (active) {
    return 'active';
  } else {
    return 'inactive';
  }
};

const resolveMark = (address, accounts) => {
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
              }) => {
  const validity = resolveValidity(address, NO_ADDRESS);
  const state = resolveState(active);
  const mark = resolveMark(address, accounts);
  return (
    <div
      className={`Cell no-select ${validity} ${state}`}
      onClick={() => onPlaceMark()}
    >
      {mark}
    </div>
  );
};

export default Cell;
