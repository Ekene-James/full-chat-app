import * as React from 'react';

import Snackbar from '@mui/material/Snackbar';

import Alert from '@mui/material/Alert';
export default function CustomizedSnackbars({type,msg,open,setOpen,autoHide=true}) {


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar sx={{ zIndex: '2000000 !important' }} open={open} autoHideDuration={autoHide ? 6000 : null} onClose={handleClose}  anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
    <Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: '100%' }}>
      {msg}
    </Alert>
  </Snackbar>
  );
}
