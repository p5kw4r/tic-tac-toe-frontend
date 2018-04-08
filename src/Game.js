import React from 'react';
import NavBar from './NavBar';
import Accounts from './Accounts';
import Board from './Board';

const Game = ({
                activeGame,
                games,
                game,
                game: { activePlayer, board },
                accounts,
                noAddress: NO_ADDRESS,
                onNavigateTo,
                onCreateGame,
                onPlaceMark,
                onGetBalance,
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
    {board ? (
      <Accounts
        activePlayer={activePlayer}
        accounts={accounts}
        games={games}
        onNavigateTo={(e) => onNavigateTo(e)}
        onCreateGame={() => onCreateGame()}
        onGetBalance={(account) => onGetBalance(account)}
      />
    ) : (
      null
    )}
  </div>
);

export default Game;
