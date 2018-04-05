import React, { Component } from 'react';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import Board from './Board';
import Info from './Info';
import './App.css';

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';

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
      player1: NO_ADDRESS,
      player2: NO_ADDRESS,
      balance1: 0,
      balance2: 0,
      gameId: 0,
      betSize: 0
    };
  }

  async componentDidMount() {
    await this.initializeContract();
    this.subscribeToEvents();
    await this.initializeGame();
    this.handleCreateGame();
    this.handleGetBalances();
  }

  async initializeContract() {
    const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    const contract = new web3.eth.Contract(abi, ADDRESS);
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
        this.handleGameOver(`Winner is ${winner}.`);
        break;
      case 'GameOverWithDraw':
        this.handleGameOver('There is no winner. Game ended with draw.');
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
      betSize: await getBetSize()
        .call()
    });
  }

  async handleGetAccounts() {
    const { getAccounts } = this.state.web3.eth;

    const accounts = await getAccounts();
    this.setState({
      player1: accounts[0],
      player2: accounts[1]
    });
  }

  async handleUpdateBoard() {
    const {
      gameId,
      contract: {
        methods: {
          getBoard
        }
      }
    } = this.state;

    this.setState({
      board: await getBoard(gameId)
        .call()
    });
  }

  handleCreateGame() {
    const {
      player1,
      betSize,
      contract: {
        methods: {
          createGame
        }
      }
    } = this.state;

    createGame()
      .send({
        from: player1,
        value: betSize
      });
  }

  handleGameCreated({ returnValues: { gameId } }) {
    this.setState({ gameId });
    this.handleJoinGame();
  }

  handleJoinGame() {
    const {
      gameId,
      player2,
      betSize,
      contract: {
        methods: {
          joinGame
        }
      }
    } = this.state;

    joinGame(gameId)
      .send({
        from: player2,
        value: betSize
      });
    this.handleGetBalances();
  }

  handleNextPlayer({ returnValues: { player } }) {
    this.setState({ activePlayer: player });
    this.handleUpdateBoard();
  }

  handlePlaceMark(column, row) {
    const {
      board,
      gameId,
      activePlayer,
      contract: {
        methods: {
          placeMark
        }
      }
    } = this.state;

    if (board[column][row] === NO_ADDRESS) {
      // transaction requires more gas than default value of 90000 wei
      placeMark(gameId, column, row)
        .send({
          from: activePlayer,
          gas: 300000
        });
    }
  }

  async handleGameOver(message) {
    await this.handleUpdateBoard();
    alert(message);
    this.handleCreateGame();
  }

  async handleGetBalances() {
    const {
      player1,
      player2,
      web3: {
        eth: {
          getBalance
        }
      }
    } = this.state;

    this.setState({
      balance1: await getBalance(player1),
      balance2: await getBalance(player2)
    });
  }

  handlePayoutSuccess({ returnValues: { recipient, amountInWei } }) {
    const amount = this.handleFromWei(amountInWei);
    console.log(`Successfully transferred ${amount} ether to ${recipient}.`);
    this.handleGetBalances();
  }

  handleFromWei(amount) {
    const {
      web3: {
        utils: {
          fromWei
        }
      }
    } = this.state;

    return fromWei(amount, 'ether');
  }

  render() {
    const {
      board,
      betSize,
      player1,
      player2,
      activePlayer,
      balance1,
      balance2
    } = this.state;

    return (
      <div className="App">
        <Board
          board={board}
          player1={player1}
          player2={player2}
          noAddress={NO_ADDRESS}
          onPlaceMark={(column, row) => this.handlePlaceMark(column, row)}
        />
        <Info
          betSize={betSize}
          player1={player1}
          player2={player2}
          activePlayer={activePlayer}
          balance1={balance1}
          balance2={balance2}
          noAddress={NO_ADDRESS}
          onFromWei={(amount) => this.handleFromWei(amount)}
        />
      </div>
    );
  }
}

export default App;
