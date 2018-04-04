import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';
import Web3 from 'web3';
import { abi, networks } from './TicTacToe.json';
import AlertDialog from './AlertDialog';
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
      balancePlayer1: 0,
      balancePlayer2: 0,
      gameId: 0,
      betSize: 0,
      dialogMessage: '',
      dialogOpen: false,
      notificationMessage: '',
      notificationOpen: false
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
    await Promise.all([this.handleGetBetSize(), this.handleGetAccounts()]);
  }

  async handleGetBetSize() {
    const { BET_SIZE: getBetSize } = this.state.contract.methods;
    const betSize = await getBetSize().call();
    this.setState({ betSize });
  }

  async handleGetAccounts() {
    const { getAccounts } = this.state.web3.eth;
    const accounts = await getAccounts();
    this.setState({ player1: accounts[0], player2: accounts[1] });
  }

  async handleUpdateBoard() {
    const { gameId, contract: { methods: { getBoard } } } = this.state;
    const board = await getBoard(gameId).call();
    this.setState({ board });
  }

  handleCreateGame() {
    const { player1, betSize, contract: { methods: { createGame } } } = this.state;
    createGame().send({ from: player1, value: betSize });
  }

  handleGameCreated({ returnValues: { gameId } }) {
    this.setState({ gameId });
    this.handleJoinGame();
  }

  handleJoinGame() {
    const { gameId, player2, betSize, contract: { methods: { joinGame } } } = this.state;
    joinGame(gameId).send({ from: player2, value: betSize });
  }

  handleNextPlayer({ returnValues: { player } }) {
    this.setState({ activePlayer: player });
    this.handleUpdateBoard();
  }

  handlePlaceMark(column, row) {
    const { board, gameId, activePlayer, contract: { methods: { placeMark } } } = this.state;
    if (board[column][row] === NO_ADDRESS) {
      // transaction requires more gas than default value of 90000 wei
      placeMark(gameId, column, row).send({ from: activePlayer, gas: 300000 });
    }
  }

  async handleGameOver(dialogMessage) {
    await this.handleUpdateBoard();
    this.setState({ dialogMessage, dialogOpen: true });
  }

  async handleGetBalances() {
    const { player1, player2, web3: { utils: { fromWei }, eth: { getBalance } } } = this.state;
    const balance1 = getBalance(player1);
    const balance2 = getBalance(player2);
    this.setState({
      balancePlayer1: fromWei(await balance1),
      balancePlayer2: fromWei(await balance2)
    });
  }

  handlePayoutSuccess({ returnValues: { recipient, amountInWei }}) {
    const { web3: { utils: { fromWei } } } = this.state;
    const amount = fromWei(amountInWei, 'ether');
    const notificationMessage = `Successfully transferred ${amount} ether to ${recipient}.`;
    this.setState({ notificationMessage, notificationOpen: true });
    this.handleGetBalances();
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
    this.handleCreateGame();
  }

  handleNotificationClose(reason) {
    if (reason !== 'clickaway') {
      this.setState({ notificationOpen: false });
    }
  }

  render() {
    const {
      board,
      player1,
      player2,
      activePlayer,
      balancePlayer1,
      balancePlayer2,
      dialogMessage,
      dialogOpen,
      notificationMessage,
      notificationOpen
    } = this.state;

    return (
      <div className="App">
        <AlertDialog
          message={dialogMessage}
          open={dialogOpen}
          onClose={() => this.handleDialogClose()}
        />
        <Board
          board={board}
          player1={player1}
          player2={player2}
          noAddress={NO_ADDRESS}
          onPlaceMark={(column, row) => this.handlePlaceMark(column, row)}
        />
        <Info
          player1={player1}
          player2={player2}
          activePlayer={activePlayer}
          balancePlayer1={balancePlayer1}
          balancePlayer2={balancePlayer2}
          noAddress={NO_ADDRESS}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={notificationOpen}
          autoHideDuration={5000}
          message={notificationMessage}
          onClose={(event, reason) => this.handleNotificationClose(reason)}
        />
      </div>
    );
  }
}

export default App;
