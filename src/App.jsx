import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import Game from './Game';
import AlertModal from './AlertModal';
import ConfigModal from './ConfigModal';
import Splash from './Splash';
import './App.css';

const INITIAL_BET_SIZE = '0.1';
const GAS_LIMIT = 300000;
const ETHER = 'ether';

// workaround to extract contract address from json interface (only needed
// during development) once factory contract is deployed to production it will
// have a fixed address
const NETWORK_IDS = Object.keys(networks);
const LAST_INDEX = NETWORK_IDS.length - 1;
const ADDRESS = networks[NETWORK_IDS[LAST_INDEX]].address;
const PORT = '8545';

const GAME_CREATED_EVENT = 'GameCreated';
const GAME_ACTIVE_EVENT = 'GameActive';
const GAME_MOVE_EVENT = 'GameMove';
const GAME_WIN_EVENT = 'GameWin';
const GAME_DRAW_EVENT = 'GameDraw';

export const NO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const INDEX_PLAYER_X = 0;
export const INDEX_PLAYER_O = 1;
export const PLAYER_X = 'Player X';
export const PLAYER_O = 'Player O';
export const URL_GAME_PATH = 'g';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: {},
      contract: {},
      games: {},
      accounts: [],
      balances: {},
      config: {
        isOpen: false,
        betSize: INITIAL_BET_SIZE,
        players: {}
      },
      alert: {
        isOpen: false,
        message: ''
      },
      isInfoOpen: true
    };
  }

  async componentDidMount() {
    const provider = new Web3.providers.WebsocketProvider(`ws://localhost:${PORT}`);
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, ADDRESS, { gas: GAS_LIMIT });
    this.subscribeToEvents(contract);
    await Promise.all([
      this.setState({
        web3,
        contract
      }),
      this.getAccounts(web3)
    ]);
    this.createGame();
  }

  subscribeToEvents({ events: { allEvents } }) {
    allEvents({}, (error, event) => this.handleEvent(event));
  }

  handleEvent({ event, returnValues: values }) {
    this.updateBalances(values);
    switch (event) {
      case GAME_CREATED_EVENT:
        this.handleGameCreated(values);
        break;
      case GAME_ACTIVE_EVENT:
        this.handleGameActive(values);
        break;
      case GAME_MOVE_EVENT:
        this.handleGameMove(values);
        break;
      case GAME_WIN_EVENT:
        this.handleGameOver(values, `${this.winner(values)} has won this game.`);
        break;
      case GAME_DRAW_EVENT:
        this.handleGameOver(values, 'There was no winner.');
        break;
      default:
        break;
    }
  }

  updateBalances({ gameId }) {
    const { games } = this.state;
    const game = games[gameId];
    if (game) {
      const { players } = game;
      players.map((player) => this.updateBalance(player));
    }
  }

  async updateBalance(player) {
    const {
      web3: {
        eth: {
          getBalance
        },
        utils: {
          fromWei
        }
      }
    } = this.state;
    const balance = await getBalance(player);
    this.setState(({ balances }) => ({
      balances: {
        ...balances,
        [player]: fromWei(balance, ETHER)
      }
    }));
  }

  async handleGameCreated({ gameId }) {
    const {
      config: {
        players
      }
    } = this.state;
    await this.setState(({ games }) => ({
      games: {
        ...games,
        [gameId]: {
          ...games[gameId],
          active: false,
          players: [
            players[INDEX_PLAYER_X],
            players[INDEX_PLAYER_O]
          ]
        }
      }
    }));
    this.joinGame(gameId, players[1]);
  }

  handleGameActive({ gameId }) {
    this.navigateTo(`/${URL_GAME_PATH}/${gameId}`);
    this.setState(({ games }) => ({
      games: {
        ...games,
        [gameId]: {
          ...games[gameId],
          active: true
        }
      }
    }));
  }

  navigateTo(path) {
    const { history } = this.props;
    history.push(path);
  }

  async handleGameMove({ gameId, board, activePlayer }) {
    this.setState(({ games }) => ({
      games: {
        ...games,
        [gameId]: {
          ...games[gameId],
          activePlayer,
          board
        }
      }
    }));
  }

  handleGameOver({ gameId, board }, message) {
    this.openAlert(message);
    this.setState(({ games }) => ({
      games: {
        ...games,
        [gameId]: {
          ...games[gameId],
          active: false,
          board
        }
      }
    }));
  }

  async getAccounts({ eth: { getAccounts } }) {
    const accounts = await getAccounts();
    this.setState(({ config }) => ({
      accounts,
      config: {
        ...config,
        players: {
          [INDEX_PLAYER_X]: accounts[INDEX_PLAYER_X],
          [INDEX_PLAYER_O]: accounts[INDEX_PLAYER_O]
        }
      },
    }));
  }

  createGame() {
    const {
      config: {
        betSize,
        players
      },
      contract: {
        methods: {
          createGame
        }
      },
      web3: {
        utils: {
          toWei
        }
      }
    } = this.state;
    createGame().send({
      from: players[INDEX_PLAYER_X],
      value: toWei(betSize, ETHER)
    });
  }

  joinGame(gameId, account) {
    const {
      config: {
        betSize
      },
      contract: {
        methods: {
          joinGame
        }
      },
      web3: {
        utils: {
          toWei
        }
      }
    } = this.state;
    joinGame(gameId).send({
      from: account,
      value: toWei(betSize, ETHER)
    });
  }

  placeMark(gameId, row, col) {
    const {
      games,
      contract: {
        methods: {
          placeMark
        }
      }
    } = this.state;
    const { active, board, activePlayer } = games[gameId];
    if (active && board[row][col] === NO_ADDRESS) {
      placeMark(gameId, row, col).send({
        from: activePlayer
      });
    }
  }

  winner({ gameId, winner }) {
    const { games } = this.state;
    const { players } = games[gameId];
    if (winner === players[INDEX_PLAYER_X]) {
      return PLAYER_X;
    }
    return PLAYER_O;
  }

  openAlert(message) {
    this.setState({
      alert: {
        isOpen: true,
        message
      }
    });
  }

  closeAlert() {
    this.setState(({ alert }) => ({
      alert: {
        ...alert,
        isOpen: false
      }
    }));
  }

  toggleInfo() {
    this.setState(({ isInfoOpen }) => ({
      isInfoOpen: !isInfoOpen
    }));
  }

  openConfig() {
    this.setState(({ config }) => ({
      config: {
        ...config,
        isOpen: true
      }
    }));
  }

  closeConfig() {
    this.setState(({ config }) => ({
      config: {
        ...config,
        isOpen: false
      }
    }));
  }

  changeBetSize(betSize) {
    this.setState(({ config }) => ({
      config: {
        ...config,
        betSize
      }
    }));
  }

  changePlayer(player, i) {
    this.setState(({ config, config: { players } }) => ({
      config: {
        ...config,
        players: {
          ...players,
          [i]: player
        }
      }
    }));
  }

  render() {
    const { accounts, balances, games, config, alert, isInfoOpen } = this.state;
    return (
      <div className="App">
        <AlertModal
          alert={alert}
          onClose={() => this.closeAlert()}
          onOpenGameConfig={() => {
            this.closeAlert();
            this.openConfig();
          }}
        />
        <ConfigModal
          accounts={accounts}
          config={config}
          onChangeBetSize={(betSize) => this.changeBetSize(betSize)}
          onChangePlayer={(player, i) => this.changePlayer(player, i)}
          onClose={() => this.closeConfig()}
          onCreateGame={() => {
            this.closeConfig();
            this.createGame();
          }}
        />
        <Switch>
          <Route
            path={`/${URL_GAME_PATH}/:gameId`}
            render={({ match: { params: { gameId } } }) => {
              const game = games[gameId];
              if (!game) {
                return <Splash />;
              }
              return (
                <Game
                  balances={balances}
                  games={games}
                  isInfoOpen={isInfoOpen}
                  onOpenGameConfig={() => this.openConfig()}
                  onPlaceMark={(row, col) => this.placeMark(gameId, row, col)}
                  onToggleInfo={() => this.toggleInfo()}
                />
              );
            }}
          />
          <Route component={Splash} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(App);
