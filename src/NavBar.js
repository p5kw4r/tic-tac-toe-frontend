import React from 'react';
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const NavBar = ({ activeGame, addresses, games, onNavigateTo, onCreateGame }) => (
  <div className="NavBar">
    <Navbar fixed="top" color="light" light expand="md">
      <Container>
        <NavbarBrand className="no-select" tag="span">
          TicTacToe DApp
        </NavbarBrand>
        <Nav navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle className="no-select" tag="span" nav caret>
              Select Game
            </DropdownToggle>
            <DropdownMenu>
              {addresses.map((address) => (
                games[address].active && (
                  <DropdownItem
                    key={address}
                    value={address}
                    disabled={address === activeGame}
                    onClick={(e) => onNavigateTo(e)}
                  >
                    {address}
                  </DropdownItem>
                )
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <NavLink
              className="no-select"
              tag="span"
              onClick={() => onCreateGame()}
            >
              New Game
            </NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  </div>
);

export default NavBar;