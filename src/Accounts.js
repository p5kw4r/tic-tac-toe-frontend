import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = { balances: [] };
  }

  async componentDidMount() {
    const { accounts, onGetBalance } = this.props;
    this.setState({
      balances: [
        await onGetBalance(accounts[0]),
        await onGetBalance(accounts[1])
      ]
    });
  }

  render() {
    const { accounts } = this.props;
    const { balances } = this.state;
    return (
      <div className="Account">
        <Table hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Account</th>
              <th>Balance (eth)</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, i) => (
              i < 2 && (
                <tr key={account}>
                  <th>{i + 1}</th>
                  <td>{account}</td>
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