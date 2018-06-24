import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AlertModal = ({
  alert: {
    isOpen,
    message
  },
  onClose,
  onOpenGameConfig
}) => (
  <div className="AlertModal">
    <Modal
      isOpen={isOpen}
      backdrop="static"
    >
      <ModalHeader toggle={() => onClose()}>
        Game Over
      </ModalHeader>
      <ModalBody>{message}</ModalBody>
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
          onClick={() => onOpenGameConfig()}
        >
          New Game
        </Button>
      </ModalFooter>
    </Modal>
  </div>
);

AlertModal.propTypes = {
  alert: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenGameConfig: PropTypes.func.isRequired
};

export default AlertModal;
