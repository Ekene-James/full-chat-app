import React from 'react'
import Typography from '@mui/material/Typography';




function Chats() {


    return (
        <div style={{width:'100%',height:'90vh',display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',textAlign:'center'}}>
            <Typography variant="h5" gutterBottom>
                Hi, Welcome to Chat center.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Please select a user to chat with from the panel on the left.
            </Typography>
            <Typography variant="h6" gutterBottom>
               Note: You can only chat with online users or those previously in chat with
            </Typography>
        </div>
    )
}

export default Chats
