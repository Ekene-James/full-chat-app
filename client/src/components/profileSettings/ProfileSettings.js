import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Grid from '@mui/material/Grid';
import { Paper , Button,TextField, MenuItem } from '@mui/material';
import { handleSnackBar, uploadDp,updateProfile } from '../../store/auth/AuthActions';
import { AuthContext } from '../../store/auth/AuthStore';
import { ChatContext } from '../../store/chats/ChatStore';
import CloseIcon from '@mui/icons-material/Close';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ProfileSettings() {
    const authCtx = React.useContext(AuthContext);
    const chatCtx = React.useContext(ChatContext);
    const user = authCtx?.state?.home?.user
    const [state, setstate] = React.useState({
        email:user.email,
    //    name:user.name,
        gender:user.gender,
        
   
    })
    const [file, setfile] = React.useState(null)
    React.useEffect(() => {
      if(authCtx?.state.updateProfileSucess)setfile(null)
        
    }, [ authCtx?.state.updateProfileSucess])
    
  
    const handleChange = e => {
        const {name,value} = e.target
         setstate({
             ...state,
            [name] : value
        })
        
    }
    const handleFileChange = e =>  setfile(e.target.files[0])  
    const handleFileUpload = e =>  {
        e.preventDefault()
      
        if(file.size/(1024 *1024).toFixed(4) > 16){
            return  authCtx.dispatch(handleSnackBar({
              type:'error',
              open:true,
              msg:'Maximum file size to upload is 16MB'
          })) 
      }
     
       
        const formData = new FormData();
          formData.append('profile_pics',file)
          formData.append('old_pics',authCtx?.state?.home?.user?.fileName)
    
          authCtx.dispatch(uploadDp(formData,authCtx.dispatch))
    }
    const handleUpdateProfile = () =>  {
          authCtx.dispatch(updateProfile(state,authCtx.dispatch))
    }
  
  return (
    <Box sx={{ flexGrow: 1, marginTop:'30px',width:'60%' }}>
      <Grid container spacing={2} sx={{width:'100%'}}>
     
        <Grid item xs={12} >
            <TextField
                name='email'
                fullWidth
                value={state.email}
                onChange={handleChange}
                label='Email'
                variant="outlined"
                type='email'
              
            />
        </Grid>
        <Grid item xs={12} >
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
    
    
    </Grid>
    <Grid container spacing={2} sx={{  marginTop:'20px' }}>
    <Grid item xs={5}>
    <input
        style={{display:'none'}}
        id='profilePix'
        type="file"
        onChange={handleFileChange}
        />
        <label htmlFor={'profilePix'} >
           <small>Change Profile Picture</small> <AddAPhotoIcon style={{cursor:'pointer',marginLeft:'2px'}}/>
        </label>
    </Grid>
    {
        file?.name &&
        <Grid item xs={7} sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          
              
            
            {
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}} >
                {file.name}
                {
                    file.size < (1024 * 1024) ? (` - ${(file.size/1024).toFixed(2)}KB`):(` - ${(file.size/(1024 * 1024)).toFixed(2)}MB`)
                }
                {
                    authCtx.state.fileProgress ? ` - ${authCtx.state.fileProgress}%` :''
                }
                <span onClick={() => setfile(null)} style={{cursor:'pointer'}}><CloseIcon/></span>
            </div>
            }
        <Button  variant="contained" onClick={handleFileUpload} color="secondary" sx={{ml:1}} disabled={authCtx?.state.loadings.updateProfile} >
            Upload
        </Button>
        </Grid>
    }
    </Grid>
      <Grid container spacing={2} sx={{  marginTop:'20px' }}>
      <Grid item xs={5}>
        <Button fullWidth variant="contained" onClick={handleUpdateProfile} color="primary" disabled={authCtx?.state.loadings.updateProfile} >
            Update Profile
        </Button>
      </Grid>
      </Grid>
    </Box>
  );
}
