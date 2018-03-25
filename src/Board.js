import React from 'react';
import Cell from './Cell';

const Board = ({ board, player1, player2, noAddress, onPlaceMarker }) => (
  <div className="Board">
    {board.map((column, i) => (
      column.map((address, j) => (
        <Cell
          key={j}
          address={address}
          player1={player1}
          player2={player2}
          noAddress={noAddress}
          onPlaceMarker={() => onPlaceMarker(i, j)}
        />
      ))
    ))}
  </div>
);

export default Board;
