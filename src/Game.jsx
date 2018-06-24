import React from 'react';
import PropTypes from 'prop-types';
import NavBar from './NavBar';
import Info from './Info';
import Board from './Board';

const Game = ({
  balances,
  games,
  game,
  isInfoOpen,
  onCreateGame,
  onPlaceMark,
  onToggleInfo
}) => (
  <div className="Game">
    <NavBar
      games={games}
      isInfoOpen={isInfoOpen}
      onCreateGame={() => onCreateGame()}
      onToggleInfo={() => onToggleInfo()}
    />
    <Board
      game={game}
      onPlaceMark={(row, col) => onPlaceMark(row, col)}
    />
    <Info
      isOpen={isInfoOpen}
      balances={balances}
      game={game}
    />
  </div>
);


Game.propTypes = {
  balances: PropTypes.objectOf(
    PropTypes.string.isRequired
  ).isRequired,
  games: PropTypes.object.isRequired,
  game: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    activePlayer: PropTypes.string.isRequired,
    board: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired
    ).isRequired,
    players: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired,
  isInfoOpen: PropTypes.bool.isRequired,
  onCreateGame: PropTypes.func.isRequired,
  onPlaceMark: PropTypes.func.isRequired,
  onToggleInfo: PropTypes.func.isRequired
};

export default Game;
