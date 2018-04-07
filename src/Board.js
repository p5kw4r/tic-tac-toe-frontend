import React from 'react';
import Cell from './Cell';

const Board = ({ game: { board, activePlayer }, accounts, noAddress: NO_ADDRESS, onPlaceMark }) => (
  <div className="Board">
    {board.map((column, i) => (
      column.map((address, j) => (
        <Cell
          key={j}
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
