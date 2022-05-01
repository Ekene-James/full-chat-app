
import React ,{createContext} from 'react';
import { ChatReducer } from './ChatReducer';

export const ChatContext = createContext();

export default function ChatContextProvider (props){
 const initialState ={
     isLoading:false,
     uploadFileSuccess:false,
     uploadFileProgress:null,
     onlineUsers : [],
     messages : [],
     conversation:{},
     currentUploadedFile:{},
     individualChats:{},
     conversations:[],
     modal:{
        active:'',
        open:false,
    },
    snackBarObj:{
        type:'success',
        open:false,
        msg:''
    },
    differentLoadings:{
        isClearChatLoading:false
    },
 };
 const [state, dispatch] = React.useReducer(ChatReducer, initialState);


const value ={
state,
dispatch
}
    return (
        <ChatContext.Provider value={value}>
            {props.children}
        </ChatContext.Provider>
    )
}