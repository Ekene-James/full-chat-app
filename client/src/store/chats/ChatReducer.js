export const ChatReducer = (state, action) => {
    switch(action.type){
        
      case "LOADING" : 
      return {
          ...state,
          isLoading: action.payload
         
        };
      case "MODAL" : 
      return {
          ...state,
          modal: action.payload
         
        };
        case "CHATS" : 
        return {
            ...state,
            chatId: action.payload.chatId,
            messages : action.payload.messages
           
          };
        case "UPDATE_MESSAGE" : 
        return {
            ...state,
            messages : [...state.messages,action.payload]
           
          };
        case "ONLINE_USERS" : 
        return {
            ...state,
            onlineUsers : action.payload
           
          };
        case "CONVERSATIONS" : 
        return {
            ...state,
            conversations : action.payload
           
          };
        case "LOCAL_POST_CHAT" : 
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.receiverId]:{
                ...state.individualChats[action.payload.receiverId],
                data:[...state?.individualChats[action.payload.receiverId]?.data,action.payload]
              }
            }
           
          };
        case "LOCAL_POST_CHAT_AS_RECEIVER" : 
          if(!state.individualChats[action.payload.senderId]){
            return state
          }
          return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.senderId]:{
                ...state.individualChats[action.payload.senderId],
                data:[...state?.individualChats[action.payload.senderId]?.data,action.payload],
                
              }
            }
           
          };
        
    
        case "LOCAL_POST_CHAT_AS_RECEIVER_FIRST_TIME" : 
       
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.senderId]:{
               chatStructure:{
                youBlocked:false,
                receiverBlocked:false,
                isFirstMsg:false,
               },
              data:[action.payload],
              getFirstLoad:true
              }
            }
           
          };
        case "LOCAL_POST_FILE_CHAT" : 
        return {
            ...state,
            currentUploadedFile : action.payload
           
          };
        case "HANDLE_LOCAL_BLOCK" : 
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.receiverId]:{
                ...state.individualChats[action.payload.receiverId],
                chatStructure:{...state.individualChats[action.payload.receiverId].chatStructure,...action.payload}
              }
            }
           
          };
        case "LOCAL_DELETE_SINGLE_CHAT_AS_RECEIVER" : 
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.senderId]:{
                ...state.individualChats[action.payload.senderId],
                data: state.individualChats[action.payload.senderId].data.filter((chats) => chats._id !== action.payload._id)
              }
            }
           
          };
        case "IS_TYPING" : 
        if(!state.individualChats[action.payload.userId]){
          return state
        }
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.userId]:{
                ...state.individualChats[action.payload.userId],
                isTyping:true
              }
            }
           
          };
        case "STOP_TYPING" : 
        if(!state.individualChats[action.payload.userId]){
          return state
        }
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.userId]:{
                ...state.individualChats[action.payload.userId],
                isTyping:false
              }
            }
           
          };
        case "LOCAL_DELETE_SINGLE_CHAT" : 
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.receiverId]:{
                ...state.individualChats[action.payload.receiverId],
                data: state.individualChats[action.payload.receiverId].data.filter((chats) => chats._id !== action.payload._id)
              }
            }
           
          };
        case "LOCAL_DELETE_ALL_CHATS" : 
        return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload]:{
                ...state.individualChats[action.payload],
                data: []
              }
            }
           
          };
        case "USER_FIRST_LOAD" : 
        if(action?.payload?.userProfile?._id){
          return {
            ...state,
            individualChats : {
              ...state.individualChats,
              [action.payload.userProfile._id]:action.payload
            }
           
          };
        }
        return {
            ...state
          };
          case "HANDLE_SNACK_BAR" : 
          return {
              ...state,
              snackBarObj: action.payload
             
            };
          case "UPLOAD_FILE_SUCCESS" : 
          return {
              ...state,
              uploadFileSuccess: action.payload
             
            };
          case "UPLOAD_FILE_PROGRESS" : 
          return {
              ...state,
              uploadFileProgress: action.payload
             
            };
          case "DIFFERENT_LOADINGS" : 
          return {
              ...state,
              differentLoadings: {
                ...state.differentLoadings,
                ...action.payload
              }
             
            };
          case "CLEAR_STATE" : 
          return {
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

        default : return state
    };

}