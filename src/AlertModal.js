import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AlertModal = ({ modal: { isOpen, message }, onClose }) => (
  <div className="AlertModal">
    <Modal isOpen={isOpen} backdrop="static">
      <ModalHeader toggle={() => onClose()}>Game Over</ModalHeader>
      <ModalBody>{message}</ModalBody>
      <ModalFooter>
        <Button outline onClick={() => onClose()}>New Game</Button>
      </ModalFooter>
    </Modal>
  </div>
);

export default AlertModal;
