import React, { Component } from 'react';
import Web3 from 'web3';
import Board from './Board';
import './App.css';

const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8545'));
const abi = [{"constant":true,"inputs":[],"name":"BET_SIZE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"}],"name":"GameCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"}],"name":"PlayerJoined","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"}],"name":"NextPlayer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winner","type":"address"}],"name":"GameOverWithWin","type":"event"},{"anonymous":false,"inputs":[],"name":"GameOverWithDraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amountInWei","type":"uint256"}],"name":"PayoutSuccess","type":"event"},{"constant":false,"inputs":[],"name":"createGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"}],"name":"joinGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"gameId","type":"uint256"}],"name":"getBoard","outputs":[{"name":"","type":"address[3][3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"},{"name":"row","type":"uint8"},{"name":"column","type":"uint8"}],"name":"placeMark","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const address = '0x9adbf80e55ed9cf4f5dc76e338665f91bbfa02c3';

const contract = new web3.eth.Contract(abi, address);
const { createGame, joinGame, getBoard, placeMark, BET_SIZE: getBetSize } = contract.methods;
const { allEvents } = contract.events;
const { getAccounts } = web3.eth;

const noAddress = '0x0000000000000000000000000000000000000000';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      activePlayer: '',
      player1: '',
      player2: '',
      gameId: 0,
      betSize: 0
    };
  }

  async componentDidMount() {
    this.handleSubscribeToEvents();
    await this.handleInitializeGame();
    this.handleCreateGame();
  }

  handleSubscribeToEvents() {
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

  async handleInitializeGame() {
    return Promise.all([this.handleGetBetSize(), this.handleGetAccounts()]);
  }

  async handleGetBetSize() {
    const betSize = await getBetSize()
      .call();
    this.setState({ betSize });
  }

  async handleGetAccounts() {
    const accounts = await getAccounts();
    this.setState({ player1: accounts[0], player2: accounts[1] });
  }

  async handleUpdateBoard() {
    const { gameId } = this.state;
    const board = await getBoard(gameId)
      .call();
    this.setState({ board });
  }

  handleCreateGame() {
    const { player1, betSize } = this.state;
    createGame()
      .send({ from: player1, value: betSize });
  }

  handleGameCreated({ returnValues: { gameId } }) {
    this.setState({ gameId });
    this.handleJoinGame();
  }

  handleJoinGame() {
    const { gameId, player2, betSize } = this.state;
    joinGame(gameId)
      .send({ from: player2, value: betSize });
  }

  handleNextPlayer({ returnValues: { player } }) {
    this.setState({ activePlayer: player });
    this.handleUpdateBoard();
  }

  handlePlaceMark(column, row) {
    const { board, gameId, activePlayer } = this.state;
    if (board[column][row] === noAddress) {
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
