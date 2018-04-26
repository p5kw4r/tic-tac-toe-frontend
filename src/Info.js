import React from 'react';
import { Table } from 'reactstrap';

const Info = ({ activePlayer, players, balances }) => (
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
          <td>{players[i] === activePlayer && <i className="fa fa-play" />}</td>
          <th scope="row">{i + 1}</th>
          <td>{i === 0 ? 'Player X' : 'Player O'}</td>
          <td>{balance}</td>
        </tr>
      ))}
      </tbody>
    </Table>
  </div>
);

export default Info;