import React, { Component } from 'react';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import Board from './Board';
import './App.css';

const noAddress = '0x0000000000000000000000000000000000000000';

// workaround to extract contract address from json interface without running
// `npm run eject` and removing `ModuleScopePlugin` from webpack config
const networkIds = Object.keys(networks);
const last = networkIds.length - 1;
const address = networks[networkIds[last]].address;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: {},
      contract: {},
      board: [],
      activePlayer: noAddress,
      player1: noAddress,
      player2: noAddress,
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
    const contract = new web3.eth.Contract(abi, address);
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
        this.handleGameOver(`Game is over, winner is ${winner}`);
        break;
      case 'GameOverWithDraw':
        this.handleGameOver('Game is over, ended with draw');
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
    const betSize = await getBetSize()
      .call();
    this.setState({ betSize });
  }

  async handleGetAccounts() {
    const { getAccounts } = this.state.web3.eth;
    const accounts = await getAccounts();
    this.setState({ player1: accounts[0], player2: accounts[1] });
  }

  async handleUpdateBoard() {
    const { gameId, contract: { methods: { getBoard } } } = this.state;
    const board = await getBoard(gameId)
      .call();
    this.setState({ board });
  }

  handleCreateGame() {
    const { player1, betSize, contract: { methods: { createGame } } } = this.state;
    createGame()
      .send({ from: player1, value: betSize });
  }

  handleGameCreated({ returnValues: { gameId } }) {
    this.setState({ gameId });
    this.handleJoinGame();
  }

  handleJoinGame() {
    const { gameId, player2, betSize, contract: { methods: { joinGame } } } = this.state;
    joinGame(gameId)
      .send({ from: player2, value: betSize });
  }

  handleNextPlayer({ returnValues: { player } }) {
    this.setState({ activePlayer: player });
    this.handleUpdateBoard();
  }

  handlePlaceMark(column, row) {
    const { board, gameId, activePlayer, contract: { methods: { placeMark } } } = this.state;
    if (board[column][row] === noAddress) {
      // transaction requires more gas than default value of 90000 wei
      placeMark(gameId, column, row)
        .send({ from: activePlayer, gas: 300000 });
    }
  }

  async handleGameOver(message) {
    await this.handleUpdateBoard();
    alert(message);
    this.handleCreateGame();
  }

  render() {
    const { board, player1, player2 } = this.state;
    return (
      <div className="App">
        <Board
          board={board}
          player1={player1}
          player2={player2}
          noAddress={noAddress}
          onPlaceMark={(column, row) => this.handlePlaceMark(column, row)}
        />
      </div>
    );
  }
}

export default App;
