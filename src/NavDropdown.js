import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';

const NavDropdown = ({ games, match: { url }, history }) => (
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
            active={gameId === url.replace('/', '')}
            onClick={({ currentTarget: { value: gameId } }) => (
              history.push(`/${gameId}`)
            )}
          >
            {`Game ${gameId}`}
          </DropdownItem>
        )
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default withRouter(NavDropdown);