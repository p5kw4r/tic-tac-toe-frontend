import React from 'react';
import NavBar from './NavBar';
import Board from './Board';
import Info from './Info';

const Game = ({
    activeGame,
    games,
    game,
    game: { activePlayer },
    accounts,
    noAddress: NO_ADDRESS,
    onNavigateTo,
    onCreateGame,
    onPlaceMark,
    ...props
  }) => (
  <div className="Game">
    <NavBar
      activeGame={activeGame}
      addresses={Object.keys(games)}
      games={games}
      onNavigateTo={(e) => onNavigateTo(e)}
      onCreateGame={() => onCreateGame()}
    />
    <Board
      game={game}
      accounts={accounts}
      noAddress={NO_ADDRESS}
      onPlaceMark={(row, col) => onPlaceMark(row, col)}
      {...props}
    />
    <Info activePlayer={activePlayer} />
  </div>
);

export default Game;
