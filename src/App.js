import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import Game from './Game';
import AlertModal from './AlertModal';
import Logo from './Logo';
import './App.css';

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';
const BET_SIZE = 100000000000000000;
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
      activeGame: 0,
      modal: {},
      info: {}
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
      case 'NextPlayer':
        this.handleNextPlayer(values);
        break;
      case 'GameOverWin':
        const winner = this.resolveWinner(values);
        this.handleGameOver(values, `Game ended with Win! Winner is ${winner}.`);
        break;
      case 'GameOverDraw':
        this.handleGameOver(values, 'Game ended with Draw! There is no winner.');
        break;
      default:
        break;
    }
  }

  handleGameCreated({ gameId }) {
    const { accounts } = this.state;
    this.joinGame(gameId, accounts[1]);
  }

  handleGameActive({ gameId }) {
    // workaround because js does not support param type overloading
    this.navigateTo({ currentTarget: { value: gameId } });
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

  async handleNextPlayer({ gameId, player: activePlayer }) {
    const board = await this.getBoard(gameId);
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

  async handleGameOver({ gameId }, message) {
    this.openModal(message);
    const board = await this.getBoard(gameId);
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
    this.setState({ accounts: await getAccounts() });
  }

  async getBalance(account) {
    const { eth: { getBalance }, utils: { fromWei } } = this.state.web3;
    const balance = await getBalance(account);
    return fromWei(balance, 'ether');
  }

  createGame() {
    const { accounts, contract: { methods: { createGame } } } = this.state;
    createGame().send({
      from: accounts[0],
      value: BET_SIZE
    });
  }

  joinGame(gameId, account) {
    const { joinGame } = this.state.contract.methods;
    joinGame(gameId).send({
      from: account,
      value: BET_SIZE
    });
  }

  async getBoard(gameId) {
    const { getBoard } = this.state.contract.methods;
    return await getBoard(gameId).call();
  }

  placeMark(gameId, row, col) {
    const { games, contract: { methods: { placeMark } } } = this.state;
    const { board, activePlayer } = games[gameId];
    if (board[row][col] === NO_ADDRESS) {
      placeMark(gameId, row, col).send({
        from: activePlayer
      });
    }
  }

  resolveWinner({ winner }) {
    const { accounts } = this.state;
    if (winner === accounts[0]) {
      return 'Player X';
    } else {
      return 'Player O';
    }
  }

  navigateTo({ currentTarget: { value: gameId } }) {
    this.setState({ activeGame: gameId });
    this.props.history.push(`/${gameId}`);
  }

  openModal(message) {
    this.setState({
      modal: {
        isOpen: true,
        message
      }
    });
  }

  closeModal() {
    this.setState(({ modal }) => ({
      modal: {
        ...modal,
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

  render() {
    const { accounts, games, activeGame, modal, info } = this.state;
    return (
      <div className="App">
        <AlertModal
          modal={modal}
          onClose={() => this.closeModal()}
          onCreateGame={() => {
            this.closeModal();
            this.createGame();
          }}
        />
        <Switch>
          {Object.keys(games).map((gameId) => (
            <Route key={gameId} exact path={`/${gameId}`} render={(props) => (
              <Game
                {...props}
                activeGame={activeGame}
                games={games}
                game={games[gameId]}
                accounts={accounts}
                noAddress={NO_ADDRESS}
                info={info}
                onNavigateTo={(e) => this.navigateTo(e)}
                onCreateGame={() => this.createGame()}
                onPlaceMark={(row, col) => this.placeMark(gameId, row, col)}
                onGetBalance={(account) => this.getBalance(account)}
                onToggleInfo={() => this.toggleInfo()}
              />
            )} />
          ))}
          <Route component={Logo} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
