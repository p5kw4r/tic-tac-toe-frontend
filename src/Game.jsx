import React from 'react';
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
  onGetBalance,
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

export default Game;
