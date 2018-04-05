import React from 'react';
import './Info.css';

const Info = ({ betSize, player1, player2, activePlayer, balance1, balance2, noAddress, onFromWei }) => (
  activePlayer !== noAddress && (
    <div className="Info">
      <div>{`Bet Size: ${onFromWei(betSize)} ether`}</div>
      <div>{`Player 1: ${player1} - ${balance1} ether`}</div>
      <div>{`Player 2: ${player2} - ${balance2} ether`}</div>
      <div>{`Active Player: ${activePlayer === player1 ? 'Player 1' : 'Player 2'}`}</div>
    </div>
  )
);

export default Info;