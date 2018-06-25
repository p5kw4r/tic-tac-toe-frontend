import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormGroup,
  FormText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import { PLAYER_X_INDEX, PLAYER_X_NAME, PLAYER_O_NAME } from './App';

const NUM_PLAYERS = 2;
const DECIMAL_RADIX = 10;

const ConfigModal = ({
  accounts,
  config: {
    isOpen,
    betSize,
    players
  },
  onClose,
  onChangeBetSize,
  onChangePlayer,
  onCreateGame
}) => {
  const playerIndices = Object.keys(players);
  return (
    <div className="ConfigModal">
      <Modal
        isOpen={isOpen}
        backdrop="static"
      >
        <ModalHeader toggle={() => onClose()}>
          Game Config
        </ModalHeader>
        <ModalBody>
          {playerIndices.map((playerIndex) => {
            const player = players[playerIndex];
            return (
              <FormGroup key={player}>
                <Label>
                  {playerName(playerIndex)}
                </Label>
                <Input
                  type="select"
                  value={player}
                  onChange={({ target: { value } }) => onChangePlayer(value, playerIndex)}
                >
                  {accounts.map((account, accountIndex) => (
                    !isOpponent(account, players, playerIndex) && (
                      <option
                        key={account}
                        value={account}
                      >
                        {`Account ${accountIndex + 1}`}
                      </option>
                    )
                  ))}
                </Input>
              </FormGroup>
            );
          })}
          <FormGroup>
            <Label>
              Bet Size
            </Label>
            <Input
              type="number"
              step={0.1}
              min={0}
              value={betSize}
              onChange={({ target: { value } }) => onChangeBetSize(value)}
            />
            <FormText>
              Amount in ether (ETH)
            </FormText>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            outline
            color="primary"
            onClick={() => onCreateGame()}
          >
            Create Game
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const isOpponent = (account, players, playerIndex) => (
  account === opponent(players, playerIndex)
);

const opponent = (players, playerIndex) => (
  players[`${opponentIndex(playerIndex)}`]
);

const opponentIndex = (playerIndex) => {
  playerIndex = parseInt(playerIndex, DECIMAL_RADIX);
  return (playerIndex + 1) % NUM_PLAYERS;
};

const playerName = (playerIndex) => {
  if (playerIndex === `${PLAYER_X_INDEX}`) {
    return PLAYER_X_NAME;
  }
  return PLAYER_O_NAME;
};

ConfigModal.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  config: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    betSize: PropTypes.string.isRequired,
    players: PropTypes.objectOf(
      PropTypes.string.isRequired
    ).isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onChangeBetSize: PropTypes.func.isRequired,
  onChangePlayer: PropTypes.func.isRequired,
  onCreateGame: PropTypes.func.isRequired
};

export default ConfigModal;
