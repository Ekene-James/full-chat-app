import React from 'react'
import { Button  } from '@mui/material';
import classes from './ForgotPassword.module.css';
import { AuthContext } from '../../../store/auth/AuthStore';
import CloseIcon from '@mui/icons-material/Close';

import { deleteProfile, handleSingleModals } from '../../../store/auth/AuthActions';

function DeleteProfile() {
    const authCtx = React.useContext(AuthContext);

    const handleClose =() => {
        authCtx.dispatch(handleSingleModals({deleteProfileModal:false}))
    }
    const handleSend =() => {
   authCtx.dispatch(deleteProfile(authCtx.dispatch))

    }
  return (
  
    <div className={classes.container}>
        <CloseIcon style={{cursor:'pointer',position:'absolute',top:2,right:2,color:'white'}} onClick={handleClose}/>

       <h3>Are you sure you want to continue?</h3>
       <p>This is not a reversable action</p>
    <div className={classes.btnContainer}>
    <Button fullWidth variant="contained" color="error" onClick={handleSend} sx={{
      pointerEvents:authCtx?.state.loadings.updateProfile ? 'none':'auto',opacity:authCtx?.state.loadings.updateProfile ? '0.6':'1',mr:1}} 
     >
       Delete
    </Button>
    <Button fullWidth variant="contained" color="secondary" onClick={handleClose}  >
       Cancel
    </Button>
    </div>
   
    </div>
  
  )
}

export default DeleteProfile