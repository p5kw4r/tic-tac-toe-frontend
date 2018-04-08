import React, { Component } from 'react';
import { Collapse } from 'reactstrap';
import NavBar from './NavBar';
import Accounts from './Accounts';
import Board from './Board';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = { isInfoOpen: false };
  }

  toggleInfo() {
    this.setState(({ isInfoOpen }) => ({ isInfoOpen: !isInfoOpen }));
  }

  render() {
    const {
      activeGame, games,
      game,
      game: { activePlayer, board },
      accounts,
      noAddress: NO_ADDRESS,
      onNavigateTo,
      onCreateGame,
      onPlaceMark,
      onGetBalance,
      ...props
    } = this.props;
    const { isInfoOpen } = this.state;
    return (
      <div className="Game">
        <NavBar
          activeGame={activeGame}
          games={games}
          isInfoOpen={isInfoOpen}
          onNavigateTo={(e) => onNavigateTo(e)}
          onCreateGame={() => onCreateGame()}
          onToggleInfo={() => this.toggleInfo()}
        />
        <Board
          game={game}
          accounts={accounts}
          noAddress={NO_ADDRESS}
          onPlaceMark={(row, col) => onPlaceMark(row, col)}
          {...props}
        />
        {board ? (
          <Collapse isOpen={isInfoOpen}>
            <Accounts
              activePlayer={activePlayer}
              accounts={accounts}
              onGetBalance={(account) => onGetBalance(account)}
            />
          </Collapse>
        ) : (
          null
        )}
      </div>
    );
  }
}

export default Game;
