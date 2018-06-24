import React from 'react';
import PropTypes from 'prop-types';
import { NO_ADDRESS, PLAYER_X_ID, PLAYER_O_ID } from './App';

const CLASS_VALID = 'valid';
const CLASS_INVALID = 'invalid';
const CLASS_ACTIVE = 'active';
const CLASS_INACTIVE = 'inactive';
const SYMBOL_PLAYER_X = 'X';
const SYMBOL_PLAYER_O = 'O';
const SYMBOL_EMPTY = '';

const Cell = ({ active, address, players, onPlaceMark }) => (
  <td
    className={`Cell no-select ${validity(address)} ${state(active)}`}
    onClick={() => onPlaceMark()}
  >
    {mark(address, players)}
  </td>
);

const validity = (address) => {
  if (address === NO_ADDRESS) {
    return CLASS_VALID;
  }
  return CLASS_INVALID;
};

const state = (active) => {
  if (active) {
    return CLASS_ACTIVE;
  }
  return CLASS_INACTIVE;
};

const mark = (address, players) => {
  const playerX = players[PLAYER_X_ID];
  const playerO = players[PLAYER_O_ID];
  if (address === playerX) {
    return SYMBOL_PLAYER_X;
  } else if (address === playerO) {
    return SYMBOL_PLAYER_O;
  }
  return SYMBOL_EMPTY;
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
