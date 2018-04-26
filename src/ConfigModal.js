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
        {Object.keys(players).map((id) => (
          <FormGroup key={players[id]}>
            <Label>{id === '0' ? 'Player X' : 'Player Y'}</Label>
            <Input
              type="select"
              value={players[id]}
              onChange={({ target: { value } }) => onChangePlayer(value, id)}
            >
              {accounts.map((account, i) => (
                account !== players[id === '0' ? '1' : '0'] && (
                  <option key={account} value={account}>
                    {`Account ${i + 1}`}
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
