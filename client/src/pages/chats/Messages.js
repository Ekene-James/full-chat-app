import React from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { format } from "timeago.js";
import classes from './Messages.module.css'
import { AuthContext } from '../../store/auth/AuthStore';
import clsx from 'clsx';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { ChatContext } from '../../store/chats/ChatStore';
import { deleteForMe,deleteForEveryOne } from '../../store/chats/ChatActions';

function Messages({msg,socketDeleteMsg}) {
const authCtx = React.useContext(AuthContext);
const chatCtx = React.useContext(ChatContext);
const [anchorEl, setAnchorEl] = React.useState(null);
const loggedinUserId = authCtx.state.home.user._id;

const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteForEvrybdy = () => {
    socketDeleteMsg(msg)
    chatCtx.dispatch(deleteForEveryOne(msg,chatCtx.dispatch))
    setAnchorEl(null);
  };
  const handleDeleteForMe = () => {
    chatCtx.dispatch(deleteForMe(msg,chatCtx.dispatch))
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);


  };
    return (
        <div  className={clsx(classes.chatContainer, {
            [classes.selfContainer]: msg.senderId === loggedinUserId,
              })}>
            <div className={clsx(classes.chat, {
              [classes.selfChat]: msg.senderId === loggedinUserId,
            })}> 
                <div className={classes.timeCont}>
                  <h6 style={{color: msg.senderId === loggedinUserId ? 'yellow' :'green' }} 
                  className={clsx(classes.from, {
                    [classes.selfFrom]: msg.senderId === loggedinUserId,
                      })}>
                      {msg.senderId === loggedinUserId ? 'Me' : msg.senderName}
                  </h6>
                  <>
                  <small className={classes.time}>{format(msg.createdAt)}</small>
                  {
                    msg.senderId === loggedinUserId &&
                    <>
                      <MoreVertIcon  onClick={handleMenu} style={{fontSize:'13px', cursor:'pointer'}} />
                 
                      <Menu
                          id="menu-appbar"
                          anchorEl={anchorEl}
                          anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                          }}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                      >
                          <MenuItem onClick={handleDeleteForMe}>Delete for me</MenuItem>
                          <MenuItem onClick={handleDeleteForEvrybdy}>Delete for everybody</MenuItem>
                         
                      </Menu>
                      </>

                  }
                  </>


                
                </div>
                  {
                    msg.msgType === 'txt' ?  <p className={classes.chatTxt}>{msg.msg}</p> : ''
                  }
                  {
                    msg.msgType === 'image' ?  <a href={msg.msg} target='_blanck'><img src={msg.msg} className={classes.chatImg} alt='img_upload'/></a> : ''
                  }
                  {
                    msg.msgType === 'file' ?   <a className={classes.a} href={msg.msg} target='_blanck'><AttachFileIcon/></a> : ''
                  }
                  {
                    msg.msgType === 'video' ?   <a className={classes.a} href={msg.msg} target='_blanck'><VideoFileIcon/></a> : ''
                  }
                  {
                    msg.msgType === 'audio' ?   <a className={classes.a} href={msg.msg} target='_blanck'><PlayCircleIcon/></a> : ''
                  }
               
            </div>
        </div>
    )
}

export default Messages
//<small className={classes.time}>{format(msg.createdAt)}</small>
