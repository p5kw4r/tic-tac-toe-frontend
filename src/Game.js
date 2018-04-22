import React from 'react';
import { Collapse } from 'reactstrap';
import NavBar from './NavBar';
import Accounts from './Accounts';
import Board from './Board';

const Game = ({
                games,
                game,
                game: { activePlayer, board },
                accounts,
                balances,
                noAddress: NO_ADDRESS,
                info,
                info: { isOpen },
                onCreateGame,
                onPlaceMark,
                onGetBalance,
                onToggleInfo
              }) => (
  <div className="Game">
    <NavBar
      games={games}
      info={info}
      onCreateGame={() => onCreateGame()}
      onToggleInfo={() => onToggleInfo()}
    />
    <Board
      game={game}
      accounts={accounts}
      noAddress={NO_ADDRESS}
      onPlaceMark={(row, col) => onPlaceMark(row, col)}
    />
    {board ? (
      <Collapse isOpen={isOpen}>
        <Accounts
          activePlayer={activePlayer}
          accounts={accounts}
          balances={balances}
        />
      </Collapse>
    ) : (
      null
    )}
  </div>
);

export default Game;
