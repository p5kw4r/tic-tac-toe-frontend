import React from 'react';
import Cell from './Cell';
import logo from './logo.svg';

const Board = ({ game: { board, activePlayer }, accounts, noAddress: NO_ADDRESS, onPlaceMark }) => {
  if (activePlayer === NO_ADDRESS) {
    return <img src={logo} alt="logo" width={800} />;
  }

  return (
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
};

export default Board;
