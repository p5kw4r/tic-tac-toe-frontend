import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

const NavDropdown = ({ activeGame, games, onNavigateTo}) => (
  <UncontrolledDropdown nav inNavbar>
    <DropdownToggle className="no-select" tag="span" nav caret>
      Select Game
    </DropdownToggle>
    <DropdownMenu>
      {Object.keys(games).map((gameId) => (
        games[gameId].active && (
          <DropdownItem
            key={gameId}
            value={gameId}
            active={gameId === activeGame}
            onClick={(e) => onNavigateTo(e)}
          >
            {`Game ${gameId}`}
          </DropdownItem>
        )
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default NavDropdown;