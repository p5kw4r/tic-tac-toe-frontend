import React from 'react';
import './Info.css';

const Info = ({ betSize, players, activePlayer, balances, noAddress: NO_ADDRESS, onFromWei }) => {
  if (activePlayer === NO_ADDRESS) {
    return <div className="Info">Loading, please wait...</div>;
  }

  return (
    <div className="Info">
      <div>{`Bet Size: ${onFromWei(betSize)} ether`}</div>
      <div>{`Player 1: ${players[0]} - Balance: ${onFromWei(balances[0])} ether`}</div>
      <div>{`Player 2: ${players[1]} - Balance: ${onFromWei(balances[1])} ether`}</div>
      <div>{`Active Player: ${activePlayer === players[0] ? 'Player 1' : 'Player 2'}`}</div>
    </div>
  );
};

export default Info;