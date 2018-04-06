import React, { Component } from 'react';
import Web3 from 'web3';
import { abi as factoryAbi, networks } from './TicTacToeFactory.json';
import { abi as gameAbi } from './TicTacToe.json';
import Board from './Board';
import './App.css';

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';
const BET_SIZE = 100000000000000000;
const GAS_LIMIT = 3000000;

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
      factory: {},
      contracts: {},
      games: {},
      accounts: [],
    };
  }

  async componentDidMount() {
    const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    const factory = new web3.eth.Contract(factoryAbi, ADDRESS, { gas: GAS_LIMIT });
    this.setState({ web3, factory });
    this.subscribeToEvents(factory);
    await this.getAccounts(web3);
    this.createGame();
  }

  subscribeToEvents(contract) {
    const { events: { allEvents } } = contract;
    allEvents({}, (error, event) => this.handleEvent(event));
  }

  handleEvent(event) {
    const { event: name, returnValues } = event;
    switch (name) {
      case 'GameCreated':
        this.handleGameCreated(returnValues);
        break;
      case 'NextPlayer':
        this.handleNextPlayer(returnValues);
        break;
      case 'GameOverWithWin':
        this.handleGameOver(returnValues, 'Game ended with win!');
        break;
      case 'GameOverWithDraw':
        this.handleGameOver(returnValues, 'Game ended with draw!');
        break;
      default:
        break;
    }
  }

  async handleGameCreated({ game: address }) {
    const { web3: { eth: { Contract } } } = this.state;
    const contract = new Contract(gameAbi, address, { gas: GAS_LIMIT });
    this.subscribeToEvents(contract);
    this.setState((prevState) => ({
      contracts: { ...prevState.contracts, [address]: contract }
    }));
    this.launchGame(address);
  }

  async handleNextPlayer({ game: address, player }) {
    const { contracts } = this.state;
    const board = await this.getBoard(contracts[address]);
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [address]: { ...prevState.games[address], activePlayer: player, board }
      }
    }));
  }

  async handleGameOver({ game: address }, message) {
    const { contracts } = this.state;
    const board = await this.getBoard(contracts[address]);
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [address]: { ...prevState.games[address], active: false, board }
      }
    }));
    alert(message);
  }

  async getAccounts({ eth: { getAccounts } }) {
    this.setState({ accounts: await getAccounts() });
  }

  createGame() {
    const { accounts, factory: { methods: { createGame } } } = this.state;
    createGame().send({ from: accounts[0] });
  }

  async launchGame(address) {
    const { accounts, contracts } = this.state;
    const contract = contracts[address];
    await Promise.all([
      this.joinGame(contract, accounts[0]),
      this.joinGame(contract, accounts[1])
    ]);
    this.setState((prevState) => ({
      games: { ...prevState.games, [address]: { active: true } }
    }));
  }

  async joinGame(contract, account) {
    const { methods: { joinGame } } = contract;
    await joinGame().send({ from: account, value: BET_SIZE });
  }

  async getBoard(contract) {
    const { methods: { getBoard } } = contract;
    return await getBoard().call();
  }

  placeMark(address, col, row) {
    const { contracts, games } = this.state;
    const { methods: { placeMark } } = contracts[address];
    const { board, activePlayer } = games[address];
    if (board[col][row] === NO_ADDRESS) {
      placeMark(col, row).send({ from: activePlayer });
    }
  }

  render() {
    const { accounts, games } = this.state;
    const addresses = Object.keys(games);
    return (
      <div className="App">
        {addresses.map((address) => (
          games[address].board && (
            <Board
              key={address}
              game={games[address]}
              accounts={accounts}
              noAddress={NO_ADDRESS}
              onPlaceMark={(col, row) => this.placeMark(address, col, row)}
            />
          )
        ))}
      </div>
    );
  }
}

export default App;
