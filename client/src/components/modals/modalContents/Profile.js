import React from 'react'
import classes from './profile.module.css';
import {useParams} from 'react-router-dom';
import { ChatContext } from '../../../store/chats/ChatStore';
function Profile() {
    const messageReceiver = useParams().id
    const chatCtx = React.useContext(ChatContext);
    const currentUser =  chatCtx?.state?.individualChats[messageReceiver]?.userProfile
  return (
    <div  className={classes.container}>
        <img src={currentUser?.dp || '/img/no-user.jpg'} alt='profile_img'  className={classes.img}/>
        <hr style={{width:'100%'}}/>
        <span> <strong>Name : </strong> {currentUser.name}</span>
        <span> <strong>Email : </strong> {currentUser.email}</span>
        <span> <strong>Gender : </strong> {currentUser.gender}</span>
    </div>
  )
}

export default Profile