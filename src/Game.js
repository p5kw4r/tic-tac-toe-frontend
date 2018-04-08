import React from 'react';
import { Alert } from 'reactstrap';
import NavBar from './NavBar';
import Board from './Board';

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
    <Alert className="mt-3" color="light">
      {`Active Player: ${activePlayer}`}
    </Alert>
  </div>
);

export default Game;
