import React from 'react'
import Typography from '@mui/material/Typography';
import { ChatContext } from '../../store/chats/ChatStore';
import {  getConversations } from '../../store/chats/ChatActions';



function Chats() {

   
    const chatCtx = React.useContext(ChatContext);
  

    React.useEffect(() => {
     // chatCtx.dispatch(getConversations(chatCtx.dispatch)) 

      }, []);

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Hi, Welcome to Chat center, Please select a user to chat with from the panel on the left.
            </Typography>
        </div>
    )
}

export default Chats
