import React from 'react'
import { Button,  } from '@mui/material';
import {useParams} from 'react-router-dom';
import { ChatContext } from '../../../store/chats/ChatStore';
import { modal,deletChats } from '../../../store/chats/ChatActions';


function DeleteChats() {
    const chatCtx = React.useContext(ChatContext);
    const messageReceiver = useParams().id
    const handleClose =() => {
        chatCtx.dispatch(modal({open:false,active:''})) 
    }
    const handleSend =() => {
      chatCtx.dispatch(deletChats(messageReceiver,chatCtx.dispatch))

    }
  return (
  
    <div style={{display:'flex',width:'100%',justifyContent:'center',alignItems:'center',flexDirection:'column',color:'white',padding:'5%'}}>
    <h4>Are you sure you want to DELETE chats with this user?</h4>
    <p>Doing so means you wont get all previous messages between this user subsequently.</p>
    <p>Also the only messages that would be deleted from the database are ones you sent.</p>
    
    <div>
    <Button variant="contained" color="secondary" onClick={handleSend} sx={{ 
        mr:1
        //pointerEvents: chatCtx.state.loadings.ClearChatsLoading ? 'none':'auto',opacity: chatCtx.state.loadings.forgotPasswordLoading ? 0.6:1 
    }} >
       Proceed
    </Button>
    <Button onClick={handleClose} variant="contained" color="error" sx={{ 
       
      //  pointerEvents: chatCtx.state.loadings.ClearChatsLoading ? 'none':'auto',opacity: chatCtx.state.loadings.forgotPasswordLoading ? 0.6:1 
    }} >
       Cancel
    </Button>

    </div>
   
    </div>
  
  )
}

export default DeleteChats