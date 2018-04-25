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
        <FormGroup>
          <Label>Player X</Label>
          <Input
            type="select"
            value={players[0]}
            onChange={({ target: { value } }) => onChangePlayer(value, 0)}
          >
            {accounts.map((account) => (
              players[1] !== account && (
                <option key={account}>{account}</option>
              )
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label>Player Y</Label>
          <Input
            type="select"
            value={players[1]}
            onChange={({ target: { value } }) => onChangePlayer(value, 1)}
          >
            {accounts.map((account) => (
              players[0] !== account && (
                <option key={account}>{account}</option>
              )
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label>Bet Size</Label>
          <Input
            type="number"
            step={0.1}
            min={0}
            value={betSize}
            onChange={({ target: { value } }) => onChangeBetSize(value)}
          />
          <FormText>Amount is specified in ether.</FormText>
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
