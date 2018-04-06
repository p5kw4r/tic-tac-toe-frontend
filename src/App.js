import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import Controls from './Controls';
import Board from './Board';
import './App.css';

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';
const GAS_LIMIT = 300000;

// workaround to extract contract address from json interface without running
// `npm run eject` and removing `ModuleScopePlugin` from webpack config
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
      players: [],
      balances: [],
      betSize: 0,
      activeGame: 0
    };
  }

  async componentDidMount() {
    await this.initializeContract();
    this.subscribeToEvents();
    await this.initializeGame();
    this.handleCreateGame();
  }

  async initializeContract() {
    const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    const contract = new web3.eth.Contract(abi, ADDRESS, { gas: GAS_LIMIT });
    // not sure, if await really required
    // this.setState({ web3: await web3, contract: await contract });
    this.setState({
      web3,
      contract
    });
  }

  subscribeToEvents() {
    const { allEvents } = this.state.contract.events;
    allEvents({}, (error, event) => this.handleEvent(error, event));
  }

  handleEvent(error, event) {
    const { event: name } = event;
    switch (name) {
      case 'GameCreated':
        this.handleGameCreated(event);
        break;
      case 'NextPlayer':
        this.handleNextPlayer(event);
        break;
      case 'GameOverWithWin':
        const { winner } = event.returnValues;
        this.handleGameOver(event, `Game over, winner is ${winner}.`);
        break;
      case 'GameOverWithDraw':
        this.handleGameOver(event, 'Game over, there is no winner.');
        break;
      case 'PayoutSuccess':
        this.handlePayoutSuccess(event);
        break;
      default:
        break;
    }
  }

  async initializeGame() {
    await Promise.all([
      this.handleGetBetSize(),
      this.handleGetAccounts()
    ]);
  }

  async handleGetBetSize() {
    const { BET_SIZE: getBetSize } = this.state.contract.methods;
    this.setState({
      betSize: await getBetSize().call()
    });
  }

  async handleGetAccounts() {
    const { getAccounts } = this.state.web3.eth;
    const accounts = await getAccounts();
    this.setState({
      players: [
        accounts[0],
        accounts[1]
      ]
    });
  }

  async handleUpdateBoard(gameId) {
    const { contract: { methods: { getBoard } } } = this.state;
    // fetching board inside setState callback doesn't seem to work
    const board = await getBoard(gameId).call();
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [gameId]: {
          ...prevState.games[gameId],
          board
        }
      }
    }));
  }

  handleCreateGame() {
    const { players, betSize, contract: { methods: { createGame } } } = this.state;
    createGame().send({
      from: players[0],
      value: betSize
    });
  }

  handleGameCreated({ returnValues: { gameId } }) {
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [gameId]: {
          active: true,
          activePlayer: NO_ADDRESS,
          board: []
        }
      }
    }));
    this.handleJoinGame(gameId);
  }

  async handleJoinGame(gameId) {
    const { players, betSize, contract: { methods: { joinGame } } } = this.state;
    await joinGame(gameId).send({
      from: players[1],
      value: betSize
    });
    this.props.history.push(`/${gameId}`);
    this.setState({
      activeGame: gameId
    });
    this.handleGetBalances();
  }

  handleNextPlayer({ returnValues: { gameId, player } }) {
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [gameId]: {
          ...prevState.games[gameId],
          activePlayer: player
        }
      }
    }));
    this.handleUpdateBoard(gameId);
  }

  handlePlaceMark(gameId, col, row) {
    const { games, contract: { methods: { placeMark } } } = this.state;
    const { board, activePlayer } = games[gameId];
    if (board[col][row] === NO_ADDRESS) {
      placeMark(gameId, col, row).send({
        from: activePlayer
      });
    }
  }

  async handleGameOver({ returnValues: { gameId } }, message) {
    await this.handleUpdateBoard(gameId);
    alert(message);
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [gameId]: {
          ...prevState.games[gameId],
          active: false
        }
      }
    }));
    this.handleCreateGame();
  }

  async handleGetBalances() {
    const { players, web3: { eth: { getBalance } } } = this.state;
    const balance1 = getBalance(players[0]);
    const balance2 = getBalance(players[1]);
    this.setState({
      balances: [
        await balance1,
        await balance2
      ]
    });
  }

  handlePayoutSuccess({ returnValues: { recipient, amountInWei } }) {
    const amount = this.handleFromWei(amountInWei);
    console.log(`Successfully transferred ${amount} ether to ${recipient}.`);
    this.handleGetBalances();
  }

  handleFromWei(amount) {
    const { web3: { utils: { fromWei } } } = this.state;
    return fromWei(amount, 'ether');
  }

  handleNavigateTo({ currentTarget: { value: gameId } }) {
    this.props.history.push(`/${gameId}`);
    this.setState({
      activeGame: gameId
    });
  }

  render() {
    const { activeGame, games, players } = this.state;
    const gameIds = Object.keys(games);
    return (
      <div className="App">
        <Controls
          activeGame={activeGame}
          gameIds={gameIds}
          games={games}
          onNavigateTo={(e) => this.handleNavigateTo(e)}
          onCreateGame={() => this.handleCreateGame()}
        />
        {gameIds.map((gameId) => (
          <Route key={gameId} exact path={`/${gameId}`} render={(props) => (
            games[gameId].active && (
              <Board
                key={gameId}
                game={games[gameId]}
                players={players}
                noAddress={NO_ADDRESS}
                onPlaceMark={(col, row) => this.handlePlaceMark(gameId, col, row)}
                {...props}
              />
            )
          )} />
        ))}
      </div>
    );
  }
}

export default withRouter(App);
