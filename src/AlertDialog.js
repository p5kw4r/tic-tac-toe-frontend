import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const AlertDialog = ({ message, open, onClose }) => (
  <div className="AlertDialog">
    <Dialog
      open={open}
      onClose={() => onClose()}
      disableBackdropClick
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Game over!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default AlertDialog;