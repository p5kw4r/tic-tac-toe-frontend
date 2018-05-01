import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import Game from './Game';
import AlertModal from './AlertModal';
import ConfigModal from './ConfigModal';
import Splash from './Splash';
import './App.css';

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';
const INITIAL_BET_SIZE = '0.1';
const GAS_LIMIT = 300000;

// workaround to extract contract address from json interface (only needed
// during development) once factory contract is deployed to production it will
// have a fixed address
const NETWORK_IDS = Object.keys(networks);
const LAST_INDEX = NETWORK_IDS.length - 1;
const ADDRESS = networks[NETWORK_IDS[LAST_INDEX]].address;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: {},
      contract: {},
      games: {},
      accounts: [],
      config: {},
      alert: {},
      info: { isOpen: true }
    };
  }

  async componentDidMount() {
    const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    const contract = new web3.eth.Contract(abi, ADDRESS, { gas: GAS_LIMIT });
    this.subscribeToEvents(contract);
    await Promise.all([
      this.setState({ web3, contract }),
      this.getAccounts(web3)
    ]);
    this.createGame();
  }

  subscribeToEvents({ events: { allEvents } }) {
    allEvents({}, (error, event) => this.handleEvent(event));
  }

  handleEvent({ event: name, returnValues: values }) {
    switch (name) {
      case 'GameCreated':
        this.handleGameCreated(values);
        break;
      case 'GameActive':
        this.handleGameActive(values);
        break;
      case 'GameMove':
        this.handleGameMove(values);
        break;
      case 'GameOverWin':
        const winner = this.resolveWinner(values);
        this.handleGameOver(values, `${winner} has won this game.`);
        break;
      case 'GameOverDraw':
        this.handleGameOver(values, 'There was no winner.');
        break;
      default:
        break;
    }
  }

  async handleGameCreated({ gameId }) {
    const { config: { players } } = this.state;
    await this.setState(({ games }) => ({
      games: {
        ...games,
        [gameId]: {
          ...games[gameId],
          players: [
            players[0],
            players[1]
          ]
        }
      }
    }));
    this.updateBalances(gameId);
    this.joinGame(gameId, players[1]);
  }

  handleGameActive({ gameId }) {
    this.navigateTo(`/g/${gameId}`);
    this.updateBalances(gameId);
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

  async handleGameMove({ gameId, board, activePlayer }) {
    this.updateBalances(gameId);
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
    this.updateBalances(gameId);
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
    this.setState({
      config: {
        betSize: INITIAL_BET_SIZE,
        players: {
          0: accounts[0],
          1: accounts[1]
        }
      },
      accounts
    });
  }

  async updateBalances(gameId) {
    const { games, web3: { eth: { getBalance }, utils: { fromWei } } } = this.state;
    const { players } = games[gameId];
    let balances = players.map((player) => getBalance(player));
    balances = await Promise.all(balances);
    balances = balances.map((balance) => fromWei(balance, 'ether'));
    this.setState(({ games }) => ({
      games: {
        ...games,
        [gameId]: {
          ...games[gameId],
          balances
        }
      }
    }));
  }

  createGame() {
    const {
      config: { betSize, players },
      contract: { methods: { createGame } },
      web3: { utils: { toWei } }
    } = this.state;
    createGame().send({
      from: players[0],
      value: toWei(betSize, 'ether')
    });
  }

  joinGame(gameId, account) {
    const {
      config: { betSize },
      contract: { methods: { joinGame } },
      web3: { utils: { toWei } }
    } = this.state;
    joinGame(gameId).send({
      from: account,
      value: toWei(betSize, 'ether')
    });
  }

  placeMark(gameId, row, col) {
    const { games, contract: { methods: { placeMark } } } = this.state;
    const { active, board, activePlayer } = games[gameId];
    if (active && board[row][col] === NO_ADDRESS) {
      placeMark(gameId, row, col).send({
        from: activePlayer
      });
    }
  }

  navigateTo(path) {
    const { history } = this.props;
    history.push(path);
  }

  resolveWinner({ gameId, winner }) {
    const { games } = this.state;
    const { players } = games[gameId];
    if (winner === players[0]) {
      return 'Player X';
    } else {
      return 'Player O';
    }
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
    this.setState(({ info: { isOpen } }) => ({
      info: {
        isOpen: !isOpen
      }
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
    const { accounts, games, config, alert, info } = this.state;
    const { players } = config;
    return (
      <div className="App">
        <AlertModal
          alert={alert}
          onClose={() => this.closeAlert()}
          onCreateGame={() => {
            this.closeAlert();
            this.openConfig();
          }}
        />
        {players && (
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
        )}
        <Switch>
          <Route
            path={`/g/:gameId`}
            render={({ match: { params: { gameId } } }) => {
              const game = games[gameId];
              if (!game) {
                return <Splash />;
              }
              return (
                <Game
                  game={game}
                  games={games}
                  noAddress={NO_ADDRESS}
                  info={info}
                  onCreateGame={() => this.openConfig()}
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

export default withRouter(App);
