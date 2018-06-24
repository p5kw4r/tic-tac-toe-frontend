import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import { URL_GAME_PATH } from './App';

class NavDropdown extends React.Component {
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
      match: {
        params: {
          gameId: activeGameId
        }
      },
      history
    } = this.props;
    const { isOpen } = this.state;
    return (
      <Dropdown
        nav
        inNavbar
        isOpen={isOpen}
        toggle={() => this.toggle()}
      >
        <DropdownToggle
          className="no-select"
          tag="span"
          nav
          caret
        >
          Select Game
        </DropdownToggle>
        <DropdownMenu>
          {Object.keys(games).map((gameId) => {
            const game = games[gameId];
            const { active } = game;
            return (
              active && (
                <DropdownItem
                  key={gameId}
                  value={gameId}
                  active={gameId === `${activeGameId}`}
                  onClick={({ currentTarget: { value: gameId } }) => (
                    history.push(`/${URL_GAME_PATH}/${gameId}`)
                  )}
                >
                  {`Game ${gameId}`}
                </DropdownItem>
              )
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

NavDropdown.propTypes = {
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      gameId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(NavDropdown);