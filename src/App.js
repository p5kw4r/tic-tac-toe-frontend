import React, { Component } from 'react';
import Web3 from 'web3';
import Board from './Board';
import './App.css';

const abi = [{"constant":true,"inputs":[],"name":"BET_SIZE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"}],"name":"GameCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"}],"name":"PlayerJoined","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"}],"name":"NextPlayer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winner","type":"address"}],"name":"GameOverWithWin","type":"event"},{"anonymous":false,"inputs":[],"name":"GameOverWithDraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amountInWei","type":"uint256"}],"name":"PayoutSuccess","type":"event"},{"constant":false,"inputs":[],"name":"createGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"}],"name":"joinGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"gameId","type":"uint256"}],"name":"getBoard","outputs":[{"name":"","type":"address[3][3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"},{"name":"row","type":"uint8"},{"name":"column","type":"uint8"}],"name":"placeMark","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const address = '0x26b586a5299285c5c42a522bb66c1c4d05085e37';
const noAddress = '0x0000000000000000000000000000000000000000';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: {},
      contract: {},
      board: [],
      activePlayer: '0x0',
      player1: '0x0',
      player2: '0x0',
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
    const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    const contract = new web3.eth.Contract(abi, address);
    // not sure, if await really required
    // this.setState({ web3, contract });
    this.setState({ web3: await web3, contract: await contract });
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
