import React from 'react';
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

const ConfigModal = ({
                       config: { isOpen, betSize },
                       onClose,
                       onChangeBetSize,
                       onCreateGame
                     }) => (
  <div className="ConfigModal">
    <Modal isOpen={isOpen} backdrop="static">
      <ModalHeader toggle={() => onClose()}>Game Config</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>Bet Size (in ether)</Label>
          <Input
            type="number"
            step={0.1}
            min={0}
            value={betSize}
            onChange={({ target: { value } }) => onChangeBetSize(value)}
          />
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
