import React from 'react';
import Controls from './Controls';
import Board from './Board';

const Game = ({
    activeGame,
    games,
    game,
    accounts,
    noAddress: NO_ADDRESS,
    onNavigateTo,
    onCreateGame,
    onPlaceMark,
    ...props
  }) => (
  <div className="Game">
    <Controls
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
  </div>
);

export default Game;
