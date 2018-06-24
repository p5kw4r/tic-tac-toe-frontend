import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import NavBar from './NavBar';
import Info from './Info';
import Board from './Board';

const Game = ({
  games,
  game,
  info,
  onCreateGame,
  onPlaceMark,
  onToggleInfo,
}) => {
  const { isOpen } = info;
  return (
    <div className="Game">
      <NavBar
        games={games}
        info={info}
        onCreateGame={() => onCreateGame()}
        onToggleInfo={() => onToggleInfo()}
      />
      <Board
        game={game}
        onPlaceMark={(row, col) => onPlaceMark(row, col)}
      />
      <Collapse isOpen={isOpen}>
        <Info game={game} />
      </Collapse>
    </div>
  );
};

Game.propTypes = {
  games: PropTypes.object.isRequired,
  game: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    activePlayer: PropTypes.string.isRequired,
    balances: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    board: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired
    ).isRequired,
    players: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired,
  info: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired
  }).isRequired,
  onCreateGame: PropTypes.func.isRequired,
  onPlaceMark: PropTypes.func.isRequired,
  onToggleInfo: PropTypes.func.isRequired
};

export default Game;
