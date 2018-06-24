import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import NavDropdown from './NavDropdown';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  }

  render() {
    const {
      games,
      info: { isOpen: isInfoOpen },
      onCreateGame,
      onToggleInfo
    } = this.props;
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
                    onClick={() => onToggleInfo()}
                  >
                    {isInfoOpen ? 'Hide Info' : 'Show Info'}
                  </NavLink>
                </NavItem>
                <NavDropdown games={games} />
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

NavBar.propTypes = {
  games: PropTypes.object.isRequired,
  info: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired
  }).isRequired,
  onCreateGame: PropTypes.func.isRequired,
  onToggleInfo: PropTypes.func.isRequired
};

export default NavBar;