import React from 'react'
import { AuthContext } from '../../store/auth/AuthStore';
import classes from './myProfile.module.css'
import {  Button,  } from '@mui/material';
import ProfileSettings from '../../components/profileSettings/ProfileSettings';
import SingleModal from '../../components/modals/SingleModal';
import { handleSingleModals, handleSnackBar } from '../../store/auth/AuthActions';
import DeleteProfile from '../../components/modals/modalContents/DeleteProfile';
import CustomizedSnackbars from '../../components/snackBar/SnackBar';
function MyProfile() {
    const authCtx = React.useContext(AuthContext);
    const [openSettings, setopenSettings] = React.useState(false)
    const user = authCtx?.state?.home?.user
  return (
    <div className={classes.container}>
    <img src={user?.dp || '/img/no-user.jpg'} alt='profile_img'  className={classes.img}/>
    <hr style={{width:'100%'}}/>
    <span> <strong>Name : </strong> {user.name}</span>
    <span> <strong>Email : </strong> {user.email}</span>
    <span> <strong>Gender : </strong> {user.gender}</span>

    <hr style={{width:'100%', margin:'10px 0'}}/>
        {
            openSettings ? (
                <Button fullWidth variant="contained" color="primary" onClick={() => setopenSettings(false)}>
                    Close Settings
                </Button>

            ) : (
                <Button fullWidth variant="contained" color="secondary" onClick={() => setopenSettings(true)}>
                    Open Settings
                </Button>

            )
        }

        {
            openSettings && <ProfileSettings/>
        }
        <hr style={{width:'100%', margin:'10px 0'}}/>
        <Button fullWidth variant="contained" color="error" onClick={() => authCtx.dispatch(handleSingleModals({deleteProfileModal:true}))}>
            Delete Profile
        </Button>

        
       <CustomizedSnackbars
       type={authCtx.state.snackBarObj.type} 
       msg={authCtx.state.snackBarObj.msg} 
       open={authCtx.state.snackBarObj.open} 
       setOpen={() => authCtx.dispatch(handleSnackBar({...authCtx.state.snackBarObj,open:false}))} 
   />
    </div>
  )
}

export default MyProfile