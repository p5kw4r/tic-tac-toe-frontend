import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';

const Board = ({
  game: {
    active,
    board,
    players
  },
  onPlaceMark
}) => (
  <div className="Board">
    <table>
      <tbody>
        {board.map((cells, row) => (
          <tr key={row}>
            {cells.map((address, col) => (
              <Cell
                key={col}
                active={active}
                address={address}
                players={players}
                onPlaceMark={() => onPlaceMark(row, col)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Board.propTypes = {
  game: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    board: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired
    ).isRequired,
    players: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired,
  onPlaceMark: PropTypes.func.isRequired
};

export default Board;
