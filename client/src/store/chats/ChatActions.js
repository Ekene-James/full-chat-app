import axios from 'axios'
export const newChat = (state) => {
    return {
      type: 'CHATS',
      payload: state
    };
  };
export const clearState = () => {
    return {
      type: 'CLEAR_STATE'
    };
  };
export const updateMsg = (state) => {
    return {
      type: 'UPDATE_MSG',
      payload: state
    };
  };
 const upploadFileSucces = (state) => {
    return {
      type: 'UPLOAD_FILE_SUCCESS',
      payload: state
    };
  };
 const upploadFileProgress = (state) => {
    return {
      type: 'UPLOAD_FILE_PROGRESS',
      payload: state
    };
  };
  
export const handleSnackBar = (state) => {
  return {
    type: 'HANDLE_SNACK_BAR',
    payload: state
  };
};
export const handleDifferentLoadings = (state) => {
  return {
    type: 'DIFFERENT_LOADINGS',
    payload: state
  };
};
export const onlineUsers = (state) => {
    return {
      type: 'ONLINE_USERS',
      payload: state
    };
  };
export const localPostChat = (state) => {
    return {
      type: 'LOCAL_POST_CHAT',
      payload: state
    };
  };
export const localPostChatAsReceiver = (state) => {
    return {
      type: 'LOCAL_POST_CHAT_AS_RECEIVER',
      payload: state
    };
  };
export const localPostChatAsReceiverFT = (state) => {
    return {
      type: 'LOCAL_POST_CHAT_AS_RECEIVER_FIRST_TIME',
      payload: state
    };
  };
export const localPostFileChat = (state) => {
    return {
      type: 'LOCAL_POST_FILE_CHAT',
      payload: state
    };
  };
export const handleLocalBlock = (state) => {
    return {
      type: 'HANDLE_LOCAL_BLOCK',
      payload: state
    };
  };
export const localdeleteSingleChat = (data) => {
    return {
      type: 'LOCAL_DELETE_SINGLE_CHAT',
      payload: data
    };
  };
export const isTyping = (data) => {
    return {
      type: 'IS_TYPING',
      payload: data
    };
  };
export const stopTyping = (data) => {
    return {
      type: 'STOP_TYPING',
      payload: data
    };
  };
export const localdeleteSingleChatAsReceiver = (data) => {
    return {
      type: 'LOCAL_DELETE_SINGLE_CHAT_AS_RECEIVER',
      payload: data
    };
  };
export const handleLocalDelete = (data) => {
    return {
      type: 'LOCAL_DELETE_ALL_CHATS',
      payload: data
    };
  };
export const modal = (state) => {
    return {
      type: 'MODAL',
      payload: state
    };
  };

  const isLoading = (state) => {
    return {
      type: 'LOADING',
      payload: state
    };
  };

  export const getConversations = async(dispatch) => {
   // dispatch(isLoading(true))
    try {
        const data = await axios.get(`/api/v1/conversation`)
       
        dispatch(isLoading(false))
   
        dispatch({
          type : 'CONVERSATIONS',
          payload:data.data.data
         }) 
    } catch (error) {
        console.log(error)
        dispatch(isLoading(false))
        alert('error, please try again later')
    }

}
  export const getMsgs = async(conversationId,dispatch) => {
    dispatch(isLoading(true))
    try {
        const data = await axios.get(`/api/v1/message/${conversationId}`)
       
        dispatch(isLoading(false))
       
        dispatch({
          type : 'MESSAGES',
          payload:data.data.data
         }) 
    } catch (error) {
        console.log(error)
        dispatch(isLoading(false))
        alert('error, please try again later')
    }

    
}
  export const postChat = async(msg,dispatch) => {
    dispatch(localPostChat(msg))
    try {
        const data = await axios.post(`/api/chats`,msg)
        console.log(data)
        
    } catch (error) {
        console.log(error)
      
        alert('error, please try again later')
    }

    
}
  export const deleteForMe = async(msg,dispatch) => {
    dispatch(localdeleteSingleChat(msg))
  
    try {
    
       const data = await axios.put(`/api/chats/singleChat/${msg._id}`,{receiverId:msg.receiverId})
       console.log(data)
        
    } catch (error) {
        console.log(error)
      
        alert('error, please try again later')
    }

    
}
  export const deleteForEveryOne = async(msg,dispatch) => {
    try {
       const data = await axios.delete(`/api/chats/singleChat/${msg._id}`)

       dispatch(localdeleteSingleChat(msg))
        
    } catch (error) {
        console.log(error)
      
        alert('error, please try again later')
    }

    
}
 
  export const userFirstLoad = async(receiverId,dispatch) => {
   dispatch(isLoading(true))
    try {
        const data = await axios.get(`/api/chats/firstLoadWithUser/${receiverId}`)
       
       dispatch(isLoading(false))
        console.log(data)
        dispatch({
          type : 'USER_FIRST_LOAD',
          payload:data.data
         }) 
     
    } catch (error) {
        console.log(error)
  
        
    }
    
}

export const blockContact = async(msg,dispatch) => {
      
  try {
  
    const data = await axios.put(`/api/chatStructure/block/${msg.receiverId}`)
    console.log(data)
    dispatch(handleLocalBlock(msg))
    dispatch(handleSnackBar({
      type:'success',
      open:true,
      msg:'User Blocked'
  }))
      
  } catch (error) {
      console.log(error)
    
      dispatch(handleSnackBar({
        type:'error',
        open:true,
        msg:error?.response?.statusText
    }))
  }

  
}
export const unBlockContact = async(msg,dispatch) => {
      
  try {
  
    const data = await axios.put(`/api/chatStructure/unblock/${msg.receiverId}`)
    console.log(data)
    dispatch(handleLocalBlock(msg))
     dispatch(handleSnackBar({
      type:'success',
      open:true,
      msg:'User Unblocked'
  }))
      
  } catch (error) {
      console.log(error)
    
      dispatch(handleSnackBar({
        type:'error',
        open:true,
        msg:error?.response?.statusText
    }))
  }

  
}
export const clearChats = async(receiverId,dispatch) => {
      
  dispatch(handleDifferentLoadings({isClearChatLoading:true}))
  try {
  
    const data = await axios.put(`/api/chats/${receiverId}`)
  
    dispatch(handleDifferentLoadings({isClearChatLoading:false}))
    dispatch(handleLocalDelete(receiverId))
    dispatch(modal({open:false,active:''}))
    dispatch(handleSnackBar({
      type:'success',
      open:true,
      msg:'Success'
  }))
      
  } catch (error) {
      console.log(error)
      dispatch(handleDifferentLoadings({isClearChatLoading:false}))
    
      dispatch(handleSnackBar({
        type:'error',
        open:true,
        msg:error?.response?.statusText
    }))
  }

  
}
export const deletChats = async(receiverId,dispatch) => {
      
  try {
  
    const data = await axios.delete(`/api/chats/${receiverId}`)
    console.log(data)
    dispatch(handleLocalDelete(receiverId))
    dispatch(modal({open:false,active:''}))
    dispatch(handleSnackBar({
      type:'success',
      open:true,
      msg:'Success'
  }))
      
  } catch (error) {
      console.log(error)
    
      dispatch(handleSnackBar({
        type:'error',
        open:true,
        msg:error?.response?.statusText
    }))
  }

  
}
export const uploadNormalFile = async(file,dispatch) => {
  dispatch(upploadFileSucces(false))
  dispatch(upploadFileProgress(null))
      
  try {
  
    const data = await axios.post(`/api/chats/file`,file,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: data => {

      dispatch(upploadFileProgress(Math.round((100 * data.loaded) / data.total)))
    },
  }
    )
 
    dispatch(upploadFileProgress(null))
    dispatch(localPostChat(data.data.data))
    dispatch(localPostFileChat(data.data.data))
    dispatch(upploadFileSucces(true))

    dispatch(handleSnackBar({
      type:'success',
      open:true,
      msg:'Success'
  }))
      
  } catch (error) {
      console.log(error)
    
      dispatch(handleSnackBar({
        type:'error',
        open:true,
        msg:error?.response?.statusText
    }))
  }

  
}
