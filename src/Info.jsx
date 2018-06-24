import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Table } from 'reactstrap';
import { PLAYER_X_INDEX, PLAYER_X_NAME, PLAYER_O_NAME } from './App';

const Info = ({
  balances,
  game: {
    activePlayer,
    players
  },
  isOpen
}) => (
  <Collapse isOpen={isOpen}>
    <div className="Info mt-5 no-select">
      <Table responsive>
        <thead>
        <tr>
          <th scope="col" />
          <th scope="col">#</th>
          <th scope="col">Account</th>
          <th scope="col">Balance</th>
        </tr>
        </thead>
        <tbody>
          {players.map((player, playerIndex) => (
            <tr key={player}>
              <td>
                {player === activePlayer && (
                  <i className="fa fa-play" />
                )}
              </td>
              <th scope="row">{playerIndex + 1}</th>
              <td>{playerName(playerIndex)}</td>
              <td>{balances[player]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </Collapse>
);

const playerName = (playerIndex) => {
  if (playerIndex === PLAYER_X_INDEX) {
    return PLAYER_X_NAME;
  }
  return PLAYER_O_NAME;
};

Info.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  balances: PropTypes.objectOf(
    PropTypes.string.isRequired
  ).isRequired,
  game: PropTypes.shape({
    activePlayer: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
};

export default Info;