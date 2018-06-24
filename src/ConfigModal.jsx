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
import { INDEX_PLAYER_X, INDEX_PLAYER_O, PLAYER_X, PLAYER_O } from './App';

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
        {Object.keys(players).map((i) => (
          <FormGroup key={players[i]}>
            <Label>
              {playerName(i)}
            </Label>
            <Input
              type="select"
              value={players[i]}
              onChange={({ target: { value } }) => onChangePlayer(value, i)}
            >
              {accounts.map((account, j) => {
                const opponent = players[`${indexOpponent(i)}`];
                return account !== opponent && (
                  <option
                    key={account}
                    value={account}
                  >
                    {`Account ${j + 1}`}
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

const indexOpponent = (i) => {
  if (i === `${INDEX_PLAYER_X}`) {
    return INDEX_PLAYER_O;
  }
  return INDEX_PLAYER_X;
};

const playerName = (i) => {
  if (i === `${INDEX_PLAYER_X}`) {
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
