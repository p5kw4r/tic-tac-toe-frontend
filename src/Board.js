import React from 'react';
import Cell from './Cell';

const Board = ({ board, players, noAddress, onPlaceMark }) => (
  <div className="Board">
    {board.map((column, i) => (
      column.map((address, j) => (
        <Cell
          key={j}
          address={address}
          players={players}
          noAddress={noAddress}
          onPlaceMark={() => onPlaceMark(i, j)}
        />
      ))
    ))}
  </div>
);

export default Board;
