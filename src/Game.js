import React from 'react';
import { Collapse } from 'reactstrap';
import NavBar from './NavBar';
import Info from './Info';
import Board from './Board';

const Game = ({
                games,
                game,
                game: { activePlayer, players, balances },
                noAddress: NO_ADDRESS,
                info,
                info: { isOpen },
                onCreateGame,
                onPlaceMark,
                onGetBalance,
                onToggleInfo,
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
      players={players}
      noAddress={NO_ADDRESS}
      onPlaceMark={(row, col) => onPlaceMark(row, col)}
    />
    <Collapse isOpen={isOpen}>
      <Info
        activePlayer={activePlayer}
        players={players}
        balances={balances}
      />
    </Collapse>
  </div>
);

export default Game;
