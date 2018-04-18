import React from 'react';
import { Collapse } from 'reactstrap';
import NavBar from './NavBar';
import Accounts from './Accounts';
import Board from './Board';

const Game = ({
                web3,
                games,
                game,
                game: { activePlayer, board },
                accounts,
                noAddress: NO_ADDRESS,
                info,
                info: { isOpen },
                onCreateGame,
                onPlaceMark,
                onGetBalance,
                onToggleInfo,
                onOpenConfig
              }) => (
  <div className="Game">
    <NavBar
      games={games}
      info={info}
      onCreateGame={() => onCreateGame()}
      onToggleInfo={() => onToggleInfo()}
      onOpenConfig={() => onOpenConfig()}
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
          web3={web3}
          activePlayer={activePlayer}
          accounts={accounts}
        />
      </Collapse>
    ) : (
      null
    )}
  </div>
);

export default Game;
