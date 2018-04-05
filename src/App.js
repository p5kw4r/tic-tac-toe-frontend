import React, { Component } from 'react';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import Board from './Board';
import Info from './Info';
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
      board: [],
      activePlayer: NO_ADDRESS,
      players: [],
      balances: [],
      gameId: 0,
      betSize: 0
    };
  }

  async componentDidMount() {
    await this.initializeContract();
    this.subscribeToEvents();
    await this.initializeGame();
    this.handleCreateGame();
  }

  async initializeContract() {
    const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    const contract = new web3.eth.Contract(abi, ADDRESS, { gas: GAS_LIMIT });
    // not sure, if await really required
    // this.setState({ web3: await web3, contract: await contract });
    this.setState({ web3, contract });
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
        this.handleGameOver(`Game over, winner is ${winner}.`);
        break;
      case 'GameOverWithDraw':
        this.handleGameOver('Game over, there is no winner.');
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
      betSize: await getBetSize().call({
        gas: GAS_LIMIT
      })
    });
  }

  async handleGetAccounts() {
    const { getAccounts } = this.state.web3.eth;
    const accounts = await getAccounts();
    this.setState({
      players: [accounts[0], accounts[1]]
    });
  }

  async handleUpdateBoard() {
    const { gameId, contract: { methods: { getBoard } } } = this.state;
    this.setState({
      board: await getBoard(gameId).call({
        gas: GAS_LIMIT
      })
    });
  }

  handleCreateGame() {
    const { players, betSize, contract: { methods: { createGame } } } = this.state;
    createGame().send({
      from: players[0],
      value: betSize,
      gas: GAS_LIMIT
    });
  }

  handleGameCreated({ returnValues: { gameId } }) {
    this.setState({ gameId });
    this.handleJoinGame();
  }

  handleJoinGame() {
    const { gameId, players, betSize, contract: { methods: { joinGame } } } = this.state;
    joinGame(gameId).send({
      from: players[1],
      value: betSize,
      gas: GAS_LIMIT
    });
    this.handleGetBalances();
  }

  handleNextPlayer({ returnValues: { player } }) {
    this.setState({
      activePlayer: player
    });
    this.handleUpdateBoard();
  }

  handlePlaceMark(column, row) {
    const { board, gameId, activePlayer, contract: { methods: { placeMark } } } = this.state;
    if (board[column][row] === NO_ADDRESS) {
      placeMark(gameId, column, row).send({
        from: activePlayer,
        gas: GAS_LIMIT
      });
    }
  }

  async handleGameOver(message) {
    await this.handleUpdateBoard();
    alert(message);
    this.handleCreateGame();
  }

  async handleGetBalances() {
    const { players, web3: { eth: { getBalance } } } = this.state;
    const balance1 = getBalance(players[0]);
    const balance2 = getBalance(players[1]);
    this.setState({
      balances: [await balance1, await balance2]
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

  render() {
    const { board, betSize, players, activePlayer, balances } = this.state;
    return (
      <div className="App">
        <Board
          board={board}
          activePlayer={activePlayer}
          players={players}
          noAddress={NO_ADDRESS}
          onPlaceMark={(column, row) => this.handlePlaceMark(column, row)}
        />
        <Info
          betSize={betSize}
          players={players}
          activePlayer={activePlayer}
          balances={balances}
          noAddress={NO_ADDRESS}
          onFromWei={(amount) => this.handleFromWei(amount)}
        />
      </div>
    );
  }
}

export default App;
