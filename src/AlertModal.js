import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AlertModal = ({ isOpen, message, onClose }) => (
  <div className="AlertModal">
    <Modal isOpen={isOpen} backdrop="static">
      <ModalHeader toggle={() => onClose()}>Game Over</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => onClose()}>OK</Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default AlertModal;
