import React from 'react';
import Cell from './Cell';

const Board = ({ board, player1, player2, noAddress, onPlaceMark }) => (
  <div className="Board">
    {board.map((column, i) => (
      column.map((address, j) => (
        <Cell
          key={j}
          address={address}
          player1={player1}
          player2={player2}
          noAddress={noAddress}
          onPlaceMark={() => onPlaceMark(i, j)}
        />
      ))
    ))}
  </div>
);

export default Board;
