import { Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

const Notification = ({ message, severity = 'info' }) => {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;