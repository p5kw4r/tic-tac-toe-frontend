import React from 'react';
import { NO_ADDRESS, INDEX_PLAYER_X, INDEX_PLAYER_O } from './constants';

const CLASS_VALID = 'valid';
const CLASS_INVALID = 'invalid';
const CLASS_ACTIVE = 'active';
const CLASS_INACTIVE = 'inactive';
const SYMBOL_PLAYER_X = 'X';
const SYMBOL_PLAYER_O = 'O';
const SYMBOL_EMPTY = '';

const validity = (address, NO_ADDRESS) => {
  return address === NO_ADDRESS ? CLASS_VALID : CLASS_INVALID;
};

const state = (active) => {
  return active ? CLASS_ACTIVE : CLASS_INACTIVE;
};

const mark = (address, players) => {
  return address === players[INDEX_PLAYER_X] ? SYMBOL_PLAYER_X
    : address === players[INDEX_PLAYER_O] ? SYMBOL_PLAYER_O
      : SYMBOL_EMPTY;
};

const Cell = ({
  active,
  address,
  players,
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
