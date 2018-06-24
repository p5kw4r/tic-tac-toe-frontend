import React from 'react';
import PropTypes from 'prop-types';
import { NO_ADDRESS, PLAYER_X_INDEX, PLAYER_O_INDEX } from './App';

const VALID_CLASS = 'valid';
const INVALID_CLASS = 'invalid';
const ACTIVE_CLASS = 'active';
const INACTIVE_CLASS = 'inactive';
const PLAYER_X_SYMBOL = 'X';
const PLAYER_O_SYMBOL = 'O';
const NO_SYMBOL = '';

const Cell = ({ active, address, players, onPlaceMark }) => (
  <td
    className={`Cell no-select ${validity(address)} ${state(active)}`}
    onClick={() => onPlaceMark()}
  >
    {symbol(address, players)}
  </td>
);

const validity = (address) => {
  if (address === NO_ADDRESS) {
    return VALID_CLASS;
  }
  return INVALID_CLASS;
};

const state = (active) => {
  if (active) {
    return ACTIVE_CLASS;
  }
  return INACTIVE_CLASS;
};

const symbol = (address, players) => {
  const playerX = players[PLAYER_X_INDEX];
  const playerO = players[PLAYER_O_INDEX];
  if (address === playerX) {
    return PLAYER_X_SYMBOL;
  } else if (address === playerO) {
    return PLAYER_O_SYMBOL;
  }
  return NO_SYMBOL;
};

Cell.propTypes = {
  active: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  onPlaceMark: PropTypes.func.isRequired
};

Cell.defaultProps = {
  active: true
};

export default Cell;
