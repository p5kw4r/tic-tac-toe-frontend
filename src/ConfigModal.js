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

const ConfigModal = ({ config: { isOpen, betSize }, onClose, onChangeBetSize }) => (
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
            onChange={(e) => onChangeBetSize(e)}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button outline onClick={() => onClose()}>Close</Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default ConfigModal;
