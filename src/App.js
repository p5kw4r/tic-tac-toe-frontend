import React, { Component } from 'react';
import Web3 from 'web3';
import Board from './Board';
import './App.css';

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
const abi = [{"constant":true,"inputs":[],"name":"BET_SIZE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"}],"name":"GameCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"}],"name":"PlayerJoined","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"}],"name":"NextPlayer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winner","type":"address"}],"name":"GameOverWithWin","type":"event"},{"anonymous":false,"inputs":[],"name":"GameOverWithDraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amountInWei","type":"uint256"}],"name":"PayoutSuccess","type":"event"},{"constant":false,"inputs":[],"name":"createGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"}],"name":"joinGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"gameId","type":"uint256"}],"name":"getBoard","outputs":[{"name":"","type":"address[3][3]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"gameId","type":"uint256"},{"name":"row","type":"uint8"},{"name":"column","type":"uint8"}],"name":"placeMark","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const address = '0x7d1bf7e89c8e1972bd5416b1005e801ed10b21b4';

const contract = new web3.eth.Contract(abi, address);
const { createGame, joinGame, getBoard, placeMark, BET_SIZE } = contract.methods;

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

  componentDidMount() {
    contract.events.allEvents({}, (error, event) => {
      switch (event.event) {
        case 'GameCreated':
          this.handleGameCreated(event);
          break;
        case 'PlayerJoined':
          this.handlePlayerJoined();
          break;
        case 'NextPlayer':
          this.handleNextPlayer(event);
          break;
        case 'GameOverWithWin':
          this.handleGameOver(`Game is over, winner is ${event.returnValues.winner}`);
          break;
        case 'GameOverWithDraw':
          this.handleGameOver('Game is over, ended with draw');
          break;
        case 'PayoutSuccess':
          this.handlePayoutSuccess(event);
          break;
        default:
          break;
      }
    });
    this.getBetSizeAsync()
      .then(() => {
        this.getAccountsAsync()
          .then(() => {
            this.handleCreateGame();
          });
      });
  }

  handleCreateGame() {
    createGame()
      .send({
        from: this.state.player1,
        value: this.state.betSize
      });
  }

  handleGameCreated(event) {
    this.setState({
      gameId: event.returnValues.gameId
    });
    joinGame(this.state.gameId)
      .send({
        from: this.state.player2,
        value: this.state.betSize
      });
    console.log(`Player 1 created new game with id ${event.returnValues.gameId}`);
  }

  handlePlayerJoined() {
    console.log(`Player 2 has joined game`);
  }

  handleNextPlayer(event) {
    this.setState({
      activePlayer: event.returnValues.player
    });
    this.updateBoardAsync();
    console.log(`Active player is ${event.returnValues.player}`);
  }

  handlePlaceMark(column, row) {
    if (this.state.board[column][row] === noAddress) {
      placeMark(this.state.gameId, column, row)
        .send({
          from: this.state.activePlayer,
          gas: 300000
        });
    }
  }

  handleGameOver(message) {
    this.updateBoardAsync()
      .then(() => {
        alert(message);
        this.handleCreateGame();
        console.log(message);
      });
  }

  handlePayoutSuccess(event) {
    const recipient = event.returnValues.recipient;
    const amountInEther = web3.utils.fromWei(event.returnValues.amountInWei, 'ether');
    console.log(`Transferred ${amountInEther} ether to ${recipient}`);
  }

  async getBetSizeAsync() {
    const betSize = await BET_SIZE().call();
    this.setState({
      betSize
    });
    const betSizeInEther = web3.utils.fromWei(betSize, 'ether');
    console.log(`Bet size is ${betSizeInEther} ether`);
  }

  async getAccountsAsync() {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      player1: accounts[0],
      player2: accounts[1]
    });
    console.log(`Player 1 is ${accounts[0]}`);
    console.log(`Player 2 is ${accounts[1]}`);
  }

  async updateBoardAsync() {
    const board = await getBoard(this.state.gameId).call();
    this.setState({
      board
    });
  }

  render() {
    return (
      <div className="App">
        <Board
          board={this.state.board}
          player1={this.state.player1}
          player2={this.state.player2}
          noAddress={noAddress}
          onPlaceMarker={(column, row) => this.handlePlaceMark(column, row)}
        />
      </div>
    );
  }
}

export default App;
