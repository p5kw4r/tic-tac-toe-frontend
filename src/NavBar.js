import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  toggle() {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  }

  navigateTo(path) {
    this.props.history.push(path);
  }

  render() {
    const { games, onNavigateTo, onCreateGame } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="NavBar">
        <Navbar fixed="top" color="light" light expand="md">
          <Container>
            <NavbarBrand className="no-select" tag="span">
              TicTacToe DApp
            </NavbarBrand>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink
                    className="no-select"
                    tag="span"
                    onClick={() => this.navigateTo('/accounts')}
                  >
                    Accounts
                  </NavLink>
                </NavItem>
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
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavBar);