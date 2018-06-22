import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import { URL_GAME_PATH } from './constants';

class NavDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  toggle() {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  }

  render() {
    const { games, match: { url }, history } = this.props;
    const { isOpen } = this.state;
    return (
      <Dropdown nav inNavbar isOpen={isOpen} toggle={() => this.toggle()}>
        <DropdownToggle className="no-select" tag="span" nav caret>
          Select Game
        </DropdownToggle>
        <DropdownMenu>
          {Object.keys(games).map((gameId) => (
            games[gameId].active && (
              <DropdownItem
                key={gameId}
                value={gameId}
                active={gameId === url.replace(`/${URL_GAME_PATH}/`, '')}
                onClick={({ currentTarget: { value: gameId } }) => (
                  history.push(`/${URL_GAME_PATH}/${gameId}`)
                )}
              >
                {`Game ${gameId}`}
              </DropdownItem>
            )
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default withRouter(NavDropdown);