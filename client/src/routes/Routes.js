import React from 'react'
import {Routes, Route,} from 'react-router-dom';
import Chats from '../pages/chats/Chats';
import MyProfile from '../pages/chats/MyProfile';
import SingleChat from '../pages/chats/SingleChat';
import Login from '../pages/login/Login';
import NoMatch from '../pages/noMatch/NoMatch';
import ResetPassword from '../pages/resetPassword/ResetPassword';
import SignUp from '../pages/signUp/SignUp';
import io from 'socket.io-client';
import { onlineUsers,localPostChatAsReceiver,localdeleteSingleChatAsReceiver,isTyping,stopTyping, modal } from '../store/chats/ChatActions';
import Dashboard from '../components/layout/Dashboard'

import ProtectedRoute from './ProtectedRoute';
import PublicRoutes from './PublicRoutes';
import { AuthContext } from '../store/auth/AuthStore';
import { getHome } from '../store/auth/AuthActions';
import { ChatContext } from '../store/chats/ChatStore';

function AppRoutes() {

    const socket = React.useRef();
    const authCtx = React.useContext(AuthContext);
    const chatCtx = React.useContext(ChatContext);

    React.useLayoutEffect(() => {
      if(!authCtx.state.isAuthenticated)return
      authCtx.dispatch(getHome(authCtx.dispatch))
      
  }, [authCtx.state.isAuthenticated])
    React.useMemo(() => {
    if(!authCtx.state.isAuthenticated)return
      socket.current = io("ws://localhost:5000",{
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": "abcd"
        }});
      socket.current.on("connect", () => {
         console.log('connected')
        });
      
  }, [authCtx.state.isAuthenticated])
  
  React.useMemo(() => {
    if(!authCtx.state.isAuthenticated)return
    const data = {
      id:authCtx.state.home.user._id,
      name:authCtx.state.home.user.name
    }
    if(authCtx.state.home.user._id)socket.current.emit("addUser", data);
     
    }, [authCtx.state.home.user,authCtx.state.isAuthenticated]);
  React.useMemo(() => {
    if(!authCtx.state.isAuthenticated)return
    socket.current.on("getUsers", (users) => {
      chatCtx.dispatch(onlineUsers(users))
  
    });
    
    }, [authCtx.state.isAuthenticated]);
  
    React.useEffect(() => {
        if(!authCtx.state.isAuthenticated)return
      socket.current.on("getMessage", (data) => {
     
      
        chatCtx.dispatch(localPostChatAsReceiver(data))
  
            
          });
        
    }, [authCtx.state.isAuthenticated])
  
    React.useEffect(() => {
        if(!authCtx.state.isAuthenticated)return
      socket.current.on("getDeleteMessage", (data) => {
       
        chatCtx.dispatch(localdeleteSingleChatAsReceiver(data))
  
            
          });
        
    }, [authCtx.state.isAuthenticated])
    React.useEffect(() => {
        if(!authCtx.state.isAuthenticated)return
      socket.current.on("is_typing", (data) => {
        chatCtx.dispatch(isTyping(data))
    
          });
        
    }, [authCtx.state.isAuthenticated])
    React.useEffect(() => {
        if(!authCtx.state.isAuthenticated)return
      socket.current.on("stop_is_typing", (data) => {
        chatCtx.dispatch(stopTyping(data))
          });
        
    }, [authCtx.state.isAuthenticated])
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
    
        <Routes>
            <Route path="/" element={<PublicRoutes />}>
                <Route index element={<Login/>} />
                <Route path='login'  element={<Login/>} />
                <Route path='signup' element={<SignUp/>} />
                <Route path='resetpassword/:resetToken' element={<ResetPassword/>} />
            </Route>
            <Route path="/" element={<ProtectedRoute />}>
                <Route path='/chat' element={<Dashboard disconnect={disconnect}/>} >
             
                <Route path='/chat' element={<Chats/>} />
                <Route path='/chat/profile' element={<MyProfile/>} />
                <Route path='/chat/:id' element={<SingleChat submit={submit} socketDeleteMsg={socketDeleteMsg} emitIsTyping={emitIsTyping} emitStopTyping={emitStopTyping}/>}/>
            
            </Route>
                
            </Route>
           
            <Route path="*" element={<NoMatch />} />
  
     
       </Routes>
        
         
    
    )
}

export default AppRoutes

 