import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Table } from 'reactstrap';
import { PLAYER_X_ID, PLAYER_X, PLAYER_O } from './App';

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
          {players.map((player, playerId) => (
            <tr key={player}>
              <td>
                {player === activePlayer && (
                  <i className="fa fa-play" />
                )}
              </td>
              <th scope="row">{playerId + 1}</th>
              <td>{playerName(playerId)}</td>
              <td>{balances[player]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </Collapse>
);

const playerName = (playerId) => {
  if (playerId === PLAYER_X_ID) {
    return PLAYER_X;
  }
  return PLAYER_O;
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