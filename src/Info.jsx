import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Table } from 'reactstrap';
import { INDEX_PLAYER_X, PLAYER_X, PLAYER_O } from './App';

const Info = ({ game: { activePlayer, players, balances }, isOpen }) => (
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
        {balances.map((balance, i) => (
          <tr key={players[i]}>
            <td>
              {players[i] === activePlayer && (
                <i className="fa fa-play" />
              )}
            </td>
            <th scope="row">{i + 1}</th>
            <td>{playerName(i)}</td>
            <td>{balance}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  </Collapse>
);

const playerName = (i) => {
  if (i === INDEX_PLAYER_X) {
    return PLAYER_X;
  }
  return PLAYER_O;
};

Info.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  game: PropTypes.shape({
    activePlayer: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    balances: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired
};

export default Info;