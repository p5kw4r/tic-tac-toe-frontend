import React from 'react';
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

const indexOfOpponent = (i) => (
  i === `${INDEX_PLAYER_X}` ? INDEX_PLAYER_O : INDEX_PLAYER_X
);

const ConfigModal = ({
 accounts,
 config: { isOpen, betSize, players },
 onClose,
 onChangeBetSize,
 onChangePlayer,
 onCreateGame
}) => (
  <div className="ConfigModal">
    <Modal isOpen={isOpen} backdrop="static">
      <ModalHeader toggle={() => onClose()}>Game Config</ModalHeader>
      <ModalBody>
        {Object.keys(players).map((i) => (
          <FormGroup key={players[i]}>
            <Label>{i === `${INDEX_PLAYER_X}` ? PLAYER_X : PLAYER_O}</Label>
            <Input
              type="select"
              value={players[i]}
              onChange={({ target: { value } }) => onChangePlayer(value, i)}
            >
              {accounts.map((account, j) => (
                account !== players[`${indexOfOpponent(i)}`] && (
                  <option key={account} value={account}>
                    {`Account ${j + 1}`}
                  </option>
                )
              ))}
            </Input>
          </FormGroup>
        ))}
        <FormGroup>
          <Label>Bet Size</Label>
          <Input
            type="number"
            step={0.1}
            min={0}
            value={betSize}
            onChange={({ target: { value } }) => onChangeBetSize(value)}
          />
          <FormText>Amount is specified in ether (ETH).</FormText>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => onClose()}>Cancel</Button>
        <Button outline color="primary" onClick={() => onCreateGame()}>
          Create Game
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default ConfigModal;
