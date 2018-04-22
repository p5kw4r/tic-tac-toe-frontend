import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { activePlayer, accounts, balances } = this.props;
    return (
      <div className="Accounts mt-5">
        <Table responsive>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Account</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, i) => (
              i < 2 && (
                <tr
                  key={account}
                  className={account === activePlayer ? 'active' : ''}
                >
                  <th scope="row">{i + 1}</th>
                  <td>{i === 0 ? 'Player X' : 'Player O'}</td>
                  <td>{balances[i]}</td>
                </tr>
              )
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Accounts;