import React,{useContext} from 'react';
import { useParams } from 'react-router-dom';
import { Paper , Button,TextField,  } from '@mui/material';
import { AuthContext } from '../../store/auth/AuthStore';
import {  handleSnackBar, resetPassword } from '../../store/auth/AuthActions';
import classes from './ResetPassword.module.css'
import CustomizedSnackbars from '../../components/snackBar/SnackBar';


function ResetPassword() {
    const{resetToken} =useParams()
    const authCtx = useContext(AuthContext);
    const [state, setstate] = React.useState({
        password : '',
    })
  
  const onLogin = e => {
      e.preventDefault();
        authCtx.dispatch(resetPassword(state,resetToken,authCtx.dispatch))

  }
  

  
      const handleChange = e => {
        const {name,value} = e.target
         setstate({
             ...state,
            [name] : value
        })
        
    }
    return (
        <div className={classes.bg}>
            <Paper className={classes.paper}>
                <div className={classes.txtField}>
            
                <TextField
                    name='password'
                    fullWidth
                    className={classes.form}
                    value={state.password}
                    onChange={handleChange}
                    label='New Password'
                    type='password'
                    variant="outlined"
                />
                
                <Button fullWidth variant="contained" color="secondary" onClick={onLogin} disabled={authCtx.state.loadings.resetPasswordLoading}>
                   Submit
                </Button>
               
                </div>
                
            </Paper>
            <CustomizedSnackbars 
                type={authCtx.state.snackBarObj.type} 
                msg={authCtx.state.snackBarObj.msg} 
                open={authCtx.state.snackBarObj.open} 
                setOpen={() => authCtx.dispatch(handleSnackBar({...authCtx.state.snackBarObj,open:false}))} 
            />
       
        </div>
    )
}

export default ResetPassword
