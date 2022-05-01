import React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import { Paper , Button,TextField,  } from '@mui/material';
import { AuthContext } from '../../store/auth/AuthStore';
import { handleSingleModals, handleSnackBar, login } from '../../store/auth/AuthActions';
import classes from './Login.module.css'
import CustomizedSnackbars from '../../components/snackBar/SnackBar';
import SingleModal from '../../components/modals/SingleModal';
import ForgotPassword from '../../components/modals/modalContents/ForgotPassword';

function Login() {
 
    const authCtx = useContext(AuthContext);
    const [state, setstate] = React.useState({
        email:'',
        password : '123456',
   
    })
  
  const onLogin = e => {
      e.preventDefault();

      if(state.email){
        authCtx.dispatch(login(state,authCtx.dispatch))
    }
  }
  const handleOpenModal = e => {
    authCtx.dispatch(handleSingleModals({forgotPassworModal:true}))
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
                    name='email'
                    fullWidth
                    value={state.email}
                    onChange={handleChange}
                    label='Email'
                    variant="outlined"
                    type='email'
                    className={classes.form}
                />
                <TextField
                    name='password'
                    fullWidth
                    className={classes.form}
                    value={state.password}
                    onChange={handleChange}
                    label='Password'
                    type='password'
                    variant="outlined"
                />
                
                <Button fullWidth variant="contained" color="secondary" onClick={onLogin} disabled={authCtx.state.loading}>
                   Login
                </Button>
               
                </div>
                <div className={classes.signUp}><h5>Not Registered?</h5>  <Link  to='/signup'>SignUp</Link></div>
                <div className={classes.link} onClick={handleOpenModal}>Forgot Password?</div>
            </Paper>
            <CustomizedSnackbars 
                type={authCtx.state.snackBarObj.type} 
                msg={authCtx.state.snackBarObj.msg} 
                open={authCtx.state.snackBarObj.open} 
                setOpen={() => authCtx.dispatch(handleSnackBar({...authCtx.state.snackBarObj,open:false}))} 
            />
            <SingleModal show={authCtx.state.singleModals.forgotPassworModal}
            >
            <ForgotPassword/>
           </SingleModal>
        </div>
    )
}

export default Login
