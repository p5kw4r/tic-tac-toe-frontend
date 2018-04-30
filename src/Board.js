import React from 'react';
import Cell from './Cell';

const Board = ({
                 game: { active, board, players },
                 noAddress: NO_ADDRESS,
                 onPlaceMark
               }) => (
  <div className="Board">
    <table>
      <tbody>
        {board.map((cells, i) => (
          <tr key={i}>
            {cells.map((address, j) => (
              <Cell
                key={j}
                active={active}
                address={address}
                players={players}
                noAddress={NO_ADDRESS}
                onPlaceMark={() => onPlaceMark(i, j)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Board;
