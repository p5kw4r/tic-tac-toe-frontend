import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

class NavDropdown extends Component {
  navigateTo({ currentTarget: { value: gameId } }) {
    this.props.history.push(`/${gameId}`);
  }

  render() {
    const { games, match: { path } } = this.props;
    return (
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
                active={gameId === path.replace('/', '')}
                onClick={(e) => this.navigateTo(e)}
              >
                {`Game ${gameId}`}
              </DropdownItem>
            )
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

export default withRouter(NavDropdown);