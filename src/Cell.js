import React from 'react';

const resolveValidity = (address, NO_ADDRESS) => {
  if (address === NO_ADDRESS) {
    return 'valid';
  } else {
    return 'invalid';
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

const Cell = ({ address, accounts, noAddress: NO_ADDRESS, onPlaceMark }) => {
  const validity = resolveValidity(address, NO_ADDRESS);
  const mark = resolveMark(address, accounts);
  return (
    <div className={`Cell no-select ${validity}`} onClick={() => onPlaceMark()}>
      {mark}
    </div>
  );
};

export default Cell;
