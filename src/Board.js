import React from 'react';
import Cell from './Cell';

const Board = ({
                 game: { active, board, activePlayer },
                 accounts,
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
          accounts={accounts}
          noAddress={NO_ADDRESS}
          onPlaceMark={() => onPlaceMark(i, j)}
        />
      ))
    ))}
  </div>
);

export default Board;
