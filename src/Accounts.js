import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balances: []
    };
  }

  async componentDidMount() {
    const { accounts } = this.props;
    this.setState({
      balances: [
        await this.getBalance(accounts[0]),
        await this.getBalance(accounts[1])
      ]
    });
  }

  async getBalance(account) {
    const { eth: { getBalance }, utils: { fromWei } } = this.props.web3;
    const balance = await getBalance(account);
    return fromWei(balance, 'ether');
  }

  render() {
    const { activePlayer, accounts } = this.props;
    const { balances } = this.state;
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