import React from 'react';
import './Info.css';

const Info = ({ player1, player2, activePlayer, balancePlayer1, balancePlayer2, noAddress }) => (
  activePlayer !== noAddress && (
    <div className="Info">
      <div>{`Player 1: ${player1} - ${balancePlayer1} ether`}</div>
      <div>{`Player 2: ${player2} - ${balancePlayer2} ether`}</div>
      <div>{`Active Player: ${activePlayer === player1 ? 'Player 1' : 'Player 2'}`}</div>
    </div>
  )
);

export default Info;