import React from 'react'
import { Route,Routes, Navigate} from 'react-router-dom'
import Dashboard from '../components/layout/Dashboard'
import Chats from '../pages/chats/Chats';
import SingleChat from '../pages/chats/SingleChat';
import io from 'socket.io-client';
import { getHome } from '../store/auth/AuthActions';
import { AuthContext } from '../store/auth/AuthStore';

import { ChatContext } from '../store/chats/ChatStore';
import { onlineUsers,localPostChatAsReceiver,localdeleteSingleChatAsReceiver,isTyping,stopTyping, modal } from '../store/chats/ChatActions';
import MyProfile from '../pages/chats/MyProfile';
import SingleModal from '../components/modals/SingleModal';
import DeleteProfile from '../components/modals/modalContents/DeleteProfile';



function ChatRoutes() {
  const socket = React.useRef();
  const authCtx = React.useContext(AuthContext);
  const chatCtx = React.useContext(ChatContext);
  React.useLayoutEffect(() => {
    
    authCtx.dispatch(getHome(authCtx.dispatch))
    
}, [])
  React.useMemo(() => {
    socket.current = io("ws://localhost:5000",{
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }});
    socket.current.on("connect", () => {
       console.log('connected')
      });
    
}, [])

React.useMemo(() => {
  const data = {
    id:authCtx.state.home.user._id,
    name:authCtx.state.home.user.name
  }
  if(authCtx.state.home.user._id)socket.current.emit("addUser", data);
   
  }, [authCtx.state.home.user]);
React.useMemo(() => {

  socket.current.on("getUsers", (users) => {
    chatCtx.dispatch(onlineUsers(users))

  });
  
  }, []);

  React.useEffect(() => {
    socket.current.on("getMessage", (data) => {
      // if(!chatCtx.state.individualChats[data.senderId]){
      //   return chatCtx.dispatch(localPostChatAsReceiverFT(data))
      // }
    
      chatCtx.dispatch(localPostChatAsReceiver(data))

          
        });
      
  }, [])

  React.useEffect(() => {
    socket.current.on("getDeleteMessage", (data) => {
     
      chatCtx.dispatch(localdeleteSingleChatAsReceiver(data))

          
        });
      
  }, [])
  React.useEffect(() => {
    socket.current.on("is_typing", (data) => {
      chatCtx.dispatch(isTyping(data))
  
        });
      
  }, [])
  React.useEffect(() => {
    socket.current.on("stop_is_typing", (data) => {
      chatCtx.dispatch(stopTyping(data))
        });
      
  }, [])
  const emitStopTyping = (receiverId) => {
    
    socket.current.emit("stop_typing",{
     sendTo:receiverId,
     userId:authCtx.state.home.user._id,
     isTyping:false
  })
  }

  const emitIsTyping = (receiverId) => {
  
    socket.current.emit("typing",{
      sendTo:receiverId,
      userId:authCtx.state.home.user._id,
      isTyping:true
  })
  }
 const submit = (msg)=> {
  
       socket.current.emit("sendMessage", msg);
 }
 const socketDeleteMsg = (msg)=> {
  
       socket.current.emit("deleteMessage", msg);
 }
 const disconnect = ()=> {
  
       socket.current.emit("logout");
 }
    return (
      <>
      <Routes>
        <Route path='chat' element={<Dashboard disconnect={disconnect}/>} >
          <Route path='/chat' element={<Chats/>} />
          <Route path='/chat/profile' element={<MyProfile/>} />
          <Route path='/chat/:id' element={<SingleChat submit={submit} socketDeleteMsg={socketDeleteMsg} emitIsTyping={emitIsTyping} emitStopTyping={emitStopTyping}/>}/>
        
        </Route>
        {  
          <Route
            path="*"
            element={<Navigate to="/chat" replace />}
           
        />
    }
      </Routes>
      <SingleModal show={authCtx.state.singleModals.deleteProfileModal}
      >
      <DeleteProfile/>
     </SingleModal>
     
      
     </>
    )
}

export default ChatRoutes
