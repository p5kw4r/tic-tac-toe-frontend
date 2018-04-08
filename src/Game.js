import React from 'react';
import { Collapse } from 'reactstrap';
import NavBar from './NavBar';
import Accounts from './Accounts';
import Board from './Board';

const Game = ({
                activeGame, games,
                game,
                game: { activePlayer, board },
                accounts,
                noAddress: NO_ADDRESS,
                info,
                info: { isOpen },
                onNavigateTo,
                onCreateGame,
                onPlaceMark,
                onGetBalance,
                onToggleInfo,
                ...props
              }) => (
  <div className="Game">
    <NavBar
      activeGame={activeGame}
      games={games}
      info={info}
      onNavigateTo={(e) => onNavigateTo(e)}
      onCreateGame={() => onCreateGame()}
      onToggleInfo={() => onToggleInfo()}
    />
    <Board
      game={game}
      accounts={accounts}
      noAddress={NO_ADDRESS}
      onPlaceMark={(row, col) => onPlaceMark(row, col)}
      {...props}
    />
    {board ? (
      <Collapse isOpen={isOpen}>
        <Accounts
          activePlayer={activePlayer}
          accounts={accounts}
          onGetBalance={(account) => onGetBalance(account)}
        />
      </Collapse>
    ) : (
      null
    )}
  </div>
);

export default Game;
