import React from 'react'
import { Button,  } from '@mui/material';
import {useParams} from 'react-router-dom';
import { ChatContext } from '../../../store/chats/ChatStore';
import { modal,clearChats } from '../../../store/chats/ChatActions';


function ClearChats() {
    const chatCtx = React.useContext(ChatContext);
    const messageReceiver = useParams().id
    const handleClose =() => {
        chatCtx.dispatch(modal({open:false,active:''})) 
    }
    const handleSend =() => {
       chatCtx.dispatch(clearChats(messageReceiver,chatCtx.dispatch))

    }
  return (
  
    <div style={{display:'flex',width:'100%',justifyContent:'center',alignItems:'center',flexDirection:'column',color:'white',padding:'5%'}}>
    <h4>Are you sure you want to CLEAR chats with this user?</h4>
    <p>Doing so means you wont get all previous messages between this user subsequently, and likelyhood for it not to be deleted from the database due to company policy.</p>
    <p>If you wish to explicitly delete chats you have sent to this user, you can choose to do so individually.</p>
    
    <div>
    <Button variant="contained" color="secondary" onClick={handleSend} sx={{ 
        mr:1,
        pointerEvents: chatCtx.state.differentLoadings.isClearChatLoading ? 'none':'auto',
        opacity: chatCtx.state.differentLoadings.isClearChatLoading ? 0.6:1 
    }} >
       Proceed
    </Button>
    <Button onClick={handleClose} variant="contained" color="error">
       Cancel
    </Button>

    </div>
   
    </div>
  
  )
}

export default ClearChats