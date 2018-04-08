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
      {Object.keys(games).map((address) => (
        games[address].active && (
          <DropdownItem
            key={address}
            value={address}
            active={address === activeGame}
            onClick={(e) => onNavigateTo(e)}
          >
            {address}
          </DropdownItem>
        )
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default NavDropdown;