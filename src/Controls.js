import React from 'react';

const Controls = ({ active: activeGame, gameIds, games, onNavigateTo, onCreateGame }) => (
  <div className="Controls">
    <select value={activeGame} onChange={(e) => onNavigateTo(e)}>
      {gameIds.map((gameId) => (
        games[gameId].active && (
          <option key={gameId} value={gameId}>
            {`Game ${gameId}`}
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