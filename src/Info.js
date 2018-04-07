import React from 'react';

const Info = ({ activePlayer }) => (
  <div className="Info">
    <div>{`Active Player: ${activePlayer}`}</div>
  </div>
);

export default Info;