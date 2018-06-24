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
import { PLAYER_X_ID, PLAYER_O_ID, PLAYER_X, PLAYER_O } from './App';

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
}) => (
  <div className="ConfigModal">
    <Modal
      isOpen={isOpen}
      backdrop="static"
    >
      <ModalHeader toggle={() => onClose()}>
        Game Config
      </ModalHeader>
      <ModalBody>
        {Object.keys(players).map((playerId) => (
          <FormGroup key={players[playerId]}>
            <Label>
              {playerName(playerId)}
            </Label>
            <Input
              type="select"
              value={players[playerId]}
              onChange={({ target: { value } }) => onChangePlayer(value, playerId)}
            >
              {accounts.map((account, accountId) => {
                const opponent = players[`${indexOpponent(accountId)}`];
                return account !== opponent && (
                  <option
                    key={account}
                    value={account}
                  >
                    {`Account ${accountId + 1}`}
                  </option>
                );
              })}
            </Input>
          </FormGroup>
        ))}
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
            Amount in ether (ETH).
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

const indexOpponent = (playerId) => {
  if (playerId === `${PLAYER_X_ID}`) {
    return PLAYER_O_ID;
  }
  return PLAYER_X_ID;
};

const playerName = (playerId) => {
  if (playerId === `${PLAYER_X_ID}`) {
    return PLAYER_X;
  }
  return PLAYER_O;
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