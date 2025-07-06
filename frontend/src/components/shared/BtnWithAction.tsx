import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

export interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { 
    open, 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm, 
    onCancel 
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface BtnWithActionProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export default function BtnWithAction(props: BtnWithActionProps) {
  const { 
    children, 
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    disabled = false
  } = props;
  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleClickOpen} style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {children}
      </div>
      <ConfirmationDialog
        open={open}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}