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

const INFO_HIDE = 'Hide Info';
const INFO_SHOW = 'Show Info';

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
      isInfoOpen,
      onOpenGameConfig,
      onToggleInfo
    } = this.props;
    const { isOpen } = this.state;
    return (
      <div className="NavBar">
        <Navbar
          fixed="top"
          color="light"
          light
          expand="md"
        >
          <Container>
            <NavbarBrand
              className="no-select"
              tag="span"
            >
              TicTacToe DApp
            </NavbarBrand>
            <NavbarToggler onClick={() => this.toggle()} />
            <Collapse
              isOpen={isOpen}
              navbar
            >
              <Nav
                className="ml-auto"
                navbar
              >
                <NavItem>
                  <NavLink
                    className="no-select"
                    tag="span"
                    onClick={() => onToggleInfo()}
                  >
                    {infoText(isInfoOpen)}
                  </NavLink>
                </NavItem>
                <NavDropdown games={games} />
                <NavItem>
                  <NavLink
                    className="no-select"
                    tag="span"
                    onClick={() => onOpenGameConfig()}
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

const infoText = (isOpen) => {
  if (isOpen) {
    return INFO_HIDE;
  }
  return INFO_SHOW;
};

NavBar.propTypes = {
  games: PropTypes.objectOf(
    PropTypes.shape({
      active: PropTypes.bool.isRequired,
      activePlayer: PropTypes.string,
      board: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.string.isRequired
        ).isRequired
      ),
      players: PropTypes.arrayOf(
        PropTypes.string.isRequired
      ).isRequired
    }).isRequired
  ).isRequired,
  isInfoOpen: PropTypes.bool.isRequired,
  onOpenGameConfig: PropTypes.func.isRequired,
  onToggleInfo: PropTypes.func.isRequired
};

export default NavBar;