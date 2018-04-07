import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Web3 from 'web3';
import { abi as factoryAbi, networks } from './TicTacToeFactory.json';
import { abi as gameAbi } from './TicTacToe.json';
import Game from './Game';
import Logo from './Logo';
import './App.css';

const NO_ADDRESS = '0x0000000000000000000000000000000000000000';
const BET_SIZE = 100000000000000000;
const GAS_LIMIT = 3000000;

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
      factory: {},
      contracts: {},
      games: {},
      accounts: [],
      activeGame: NO_ADDRESS,
    };
  }

  async componentDidMount() {
    const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    const factory = new web3.eth.Contract(factoryAbi, ADDRESS, { gas: GAS_LIMIT });
    this.setState({
      web3,
      factory
    });
    this.subscribeToEvents(factory);
    await this.getAccounts(web3);
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
      case 'GameLaunched':
        this.handleGameLaunched(values);
        break;
      case 'NextPlayer':
        this.handleNextPlayer(values);
        break;
      case 'GameOverWin':
        const { winner } = values;
        this.handleGameOver(values, `Game is over! Winner is ${winner}.`);
        break;
      case 'GameOverDraw':
        this.handleGameOver(values, 'Game is over! There is no winner.');
        break;
      case 'Payout':
        this.handlePayout(values);
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
      contracts: {
        ...prevState.contracts,
        [address]: contract
      }
    }));
    this.launchGame(address);
  }

  handleGameLaunched({ game: address }) {
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [address]: {
          ...prevState.games[address],
          active: true
        }
      },
      activeGame: address
    }));
    this.props.history.push(`/${address}`);
  }

  async handleNextPlayer({ game: address, player }) {
    const { contracts } = this.state;
    const board = await this.getBoard(contracts[address]);
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [address]: {
          ...prevState.games[address],
          activePlayer: player,
          board
        }
      }
    }));
  }

  async handleGameOver({ game: address }, message) {
    const { contracts } = this.state;
    const board = await this.getBoard(contracts[address]);
    this.setState((prevState) => ({
      games: {
        ...prevState.games,
        [address]: {
          ...prevState.games[address],
          active: false,
          board
        }
      }
    }));
    alert(message);
    this.createGame();
  }

  handlePayout({ amountInWei, recipient }) {
    const { web3: { utils: { fromWei } } } = this.state;
    const amount = fromWei(amountInWei);
    console.log(`Succesfully transferred ${amount} ether to ${recipient}.`);
  }

  async getAccounts({ eth: { getAccounts } }) {
    this.setState({
      accounts: await getAccounts()
    });
  }

  createGame() {
    const { accounts, factory: { methods: { createGame } } } = this.state;
    createGame().send({
      from: accounts[0]
    });
  }

  launchGame(address) {
    const { accounts, contracts } = this.state;
    const contract = contracts[address];
    this.joinGame(contract, accounts[0]);
    this.joinGame(contract, accounts[1]);
  }

  joinGame({ methods: { joinGame } }, account) {
    joinGame().send({
      from: account,
      value: BET_SIZE
    });
  }

  async getBoard({ methods: { getBoard } }) {
    return await getBoard().call();
  }

  placeMark(address, row, col) {
    const { contracts, games } = this.state;
    const { methods: { placeMark } } = contracts[address];
    const { board, activePlayer } = games[address];
    if (board[row][col] === NO_ADDRESS) {
      placeMark(row, col).send({
        from: activePlayer
      });
    }
  }

  navigateTo({ currentTarget: { value: address } }) {
    this.setState({
      activeGame: address
    });
    this.props.history.push(`/${address}`);
  }

  render() {
    const { accounts, games, activeGame } = this.state;
    return (
      <div className="App">
        <Switch>
          {Object.keys(games).map((address) => (
            <Route key={address} exact path={`/${address}`} render={(props) => (
              <Game
                activeGame={activeGame}
                games={games}
                game={games[address]}
                accounts={accounts}
                noAddress={NO_ADDRESS}
                onNavigateTo={(e) => this.navigateTo(e)}
                onCreateGame={() => this.createGame()}
                onPlaceMark={(row, col) => this.placeMark(address, row, col)}
                {...props}
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
