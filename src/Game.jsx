import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar';
import Info from './Info';
import Board from './Board';

const Game = ({
  balances,
  match: {
    params: {
      gameId
    }
  },
  games,
  isInfoOpen,
  onOpenGameConfig,
  onPlaceMark,
  onToggleInfo
}) => {
  const game = games[gameId];
  return (
    <div className="Game">
      <NavBar
        games={games}
        isInfoOpen={isInfoOpen}
        onOpenGameConfig={() => onOpenGameConfig()}
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
};

Game.propTypes = {
  balances: PropTypes.objectOf(
    PropTypes.string.isRequired
  ).isRequired,
  games: PropTypes.objectOf(
    PropTypes.shape({
      active: PropTypes.bool.isRequired,
      activePlayer: PropTypes.string,
      board: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.string.isRequired
        ).isRequired
      ),
      players: PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired
    }).isRequired
  ).isRequired,
  isInfoOpen: PropTypes.bool.isRequired,
  onOpenGameConfig: PropTypes.func.isRequired,
  onPlaceMark: PropTypes.func.isRequired,
  onToggleInfo: PropTypes.func.isRequired
};

export default withRouter(Game);
