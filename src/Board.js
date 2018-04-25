import React from 'react';
import Cell from './Cell';

const Board = ({
                 game: { active, board },
                 players,
                 noAddress: NO_ADDRESS,
                 onPlaceMark
               }) => (
  <div className="Board">
    {board.map((cells, i) => (
      cells.map((address, j) => (
        <Cell
          key={j}
          active={active}
          address={address}
          players={players}
          noAddress={NO_ADDRESS}
          onPlaceMark={() => onPlaceMark(i, j)}
        />
      ))
    ))}
  </div>
);

export default Board;
