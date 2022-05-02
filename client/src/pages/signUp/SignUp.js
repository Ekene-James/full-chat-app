import React from 'react';
import {Link,useNavigate } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {Paper , Button,TextField, Grid, Typography,MenuItem  } from '@mui/material';
import { AuthContext } from '../../store/auth/AuthStore';
import { handleSnackBar, register } from '../../store/auth/AuthActions';
import classes from './SignUp.module.css'
import CustomizedSnackbars from '../../components/snackBar/SnackBar';
import Stack from '@mui/material/Stack';

function SignUp() {
 
    const navigate = useNavigate()
    const authCtx = React.useContext(AuthContext);
    const [state, setstate] = React.useState({
        name:'',
        email:'',
        password:'123456',
        gender:''
    })
   
  const submit = e => {
    e.preventDefault();
    const data ={
        ...state,
        role:'user'
    }
    
    authCtx.dispatch(register(data,authCtx.dispatch,navigate))
     

  }
  
      const handleChange = e => {
        const {name,value} = e.target
         setstate({
             ...state,
            [name] : value
        })
        
    }

  
    return (
            <div className={classes.container}>
            
          
            <Paper className={classes.paper}>
            <Typography variant="h4"  gutterBottom>
                    Sign-up
              </Typography>
            <form onSubmit={submit}>
            <Grid container spacing={3}>
          
                <Grid item xs={12} md={6}>
                    <TextField
                        name='name'
                        fullWidth
                        required
                        onChange={handleChange}
                        label='Name'
                        variant="outlined"
                        type='text'
                        value={state.name}
                       
                    />
                </Grid>
            
                <Grid item xs={12} md={6}>
                    <TextField
                        name='email'
                        fullWidth
                        required
                        onChange={handleChange}
                        label='Email'
                        variant="outlined"
                        type='email'
                        value={state.email}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                <TextField
                    name="gender"
                    select
                    fullWidth
                    label="Gender"
                    onChange={handleChange}
                    helperText="Gender"
                    variant="outlined"
                    value={state.gender || ''}
                    
                    >
                        {[
                            {
                            label:'Male',
                            value:'male'
                        },
                            {
                            label:'Female',
                            value:'female'
                        },
                            {
                            label:'Other',
                            value:'other'
                        },
                           
                        ]
                        .map((option,i) => (
                            <MenuItem key={i} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                </TextField>
                </Grid>
              
                <Grid item xs={12} md={6}>
                    <TextField
                        name='password'
                        fullWidth
                        required
                        onChange={handleChange}
                        label='Password'
                        variant="outlined"
                        type='password'
                        value={state.password}
                    />
                </Grid>
                <div className={classes.btnContainer}>
                    <Link className={classes.link} to='/login'>
                    <Button startIcon={<ArrowBackIosIcon />} variant="contained" type='button' color="secondary" >
                        Login
                    </Button>

                    </Link>
                    <Button variant="contained" type='submit' color="primary" disabled={authCtx.state.loading} sx={{ml:1}} >
                        Sign Up
                    </Button>

                </div>
               
        </Grid>
    </form>
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

export default SignUp
