import React from 'react';

const Controls = ({ activeGame, addresses, games, onNavigateTo, onCreateGame }) => (
  <div className="Controls">
    <select value={activeGame} onChange={(e) => onNavigateTo(e)}>
      {addresses.map((address) => (
        games[address].active && (
          <option key={address} value={address}>
            {address}
          </option>
        )
      ))}
    </select>
    <button onClick={() => onCreateGame()}>
      New Game
    </button>
  </div>
);

export default Controls;