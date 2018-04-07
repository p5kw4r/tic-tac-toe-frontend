import React from 'react';
import Cell from './Cell';

const Board = ({ game: { board, activePlayer }, accounts, noAddress: NO_ADDRESS, onPlaceMark }) => (
  board ? (
    <div className="Board">
      {board.map((cells, i) => (
        cells.map((address, j) => (
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
  ) : (
    null
  )
);

export default Board;
