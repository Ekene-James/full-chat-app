import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'

export const handleSnackBar = (state) => {
    return {
      type: 'HANDLE_SNACK_BAR',
      payload: state
    };
  };
export const handleUpdateUserProfile = (state) => {
    return {
      type: 'HANDLE_UPDATE_USER_PROFILE',
      payload: state
    };
  };
export const setReceiverProfile = (state) => {
    return {
      type: 'RECEIVER_PROFILE',
      payload: state
    };
  };
export const handleErrors = (state) => {
    return {
      type: 'HANDLE_ERRORS',
      payload: state
    };
  };
export const handleLoadings = (state) => {
    return {
      type: 'LOADINGS',
      payload: state
    };
  };
export const handleSingleModals = (state) => {
    return {
      type: 'SINGLE_MODALS',
      payload: state
    };
  };


export const setCurrentUser = user => {
    return {
         type: 'LOGIN',
         payload: user
     };
   };
  const isLoading = (state) => {
    return {
      type: 'LOADING',
      payload: state
    };
  };
  export const chattingWith = (state) => {
    return {
      type: 'CHATTING_WITH',
      payload: state
    };
  };
  const upploadFileProgress = (state) => {
    return {
      type: 'UPLOAD_FILE_PROGRESS',
      payload: state
    };
  };
  const updateProfileSucces = (state) => {
    return {
      type: 'UPDATE_PROFILE_SUCCESS',
      payload: state
    };
  };
  const deleteProfileSucces = (state) => {
    return {
      type: 'DELETE_PROFILE_SUCCESS',
      payload: state
    };
  };
  const signUserIn = (token,dispatch) => {

    localStorage.setItem("user", JSON.stringify({token}));
    //set token as auth header using axios
    setAuthToken(token);
    const decoded = jwt_decode(token);
    const cred = {
        ...decoded,
    }
    dispatch(isLoading(false))
    dispatch({
     type : 'LOGIN',
     payload:cred
    }) 
  }
  const handleError = (error,dispatch) => {
        let msg ;
        if(error?.response?.statusText === "Internal Server Error"){
            msg= error?.response?.statusText
        }else{
            msg = error?.response?.data?.error?.split(',')[0]
        }
        dispatch(handleSnackBar({
          type:'error',
          open:true,
          msg:msg
      }))
  }
export const login =async (state,dispatch) => {
    dispatch(isLoading(true))
   
    try {
        const user = await axios.post("/api/auth/login",state)
        signUserIn(user.data.token,dispatch)
     
    } catch (error) {
        console.log(error)
        dispatch(isLoading(false))
        handleError(error,dispatch)
    }

    
}
export const logout = ()  => {
    //clear local storage
    localStorage.removeItem("user");
    //clear authHeader
    setAuthToken(false);

  
   return {
        type: 'LOGOUT'  
    }

        
  };
export const getRoute = (route) => {
return {
    type : 'ROUTE',
    payload : route
}
    
}
export const toggleChatWindow = (state) => {
return {
    type : 'CHAT_WINDOW',
    payload : state
}
    
}

export const register = async(data,dispatch) => {
    dispatch(isLoading(true))

    try {
        const user = await axios.post("/api/auth/register",data)
    
        //if(user.status === 200) history('/login')
    
        signUserIn(user.data.token,dispatch)
    } catch (error) {
        dispatch(isLoading(false))
        console.log(error.response)
      handleError(error,dispatch)
       
     
    
    }

    
}
export const resetPassword = async(data,token,dispatch) => {
    dispatch(handleLoadings({resetPasswordLoading:true}))
    
   
    try {
        const user = await axios.put(`/api/auth/resetpassword/${token}`,data)
        console.log(user)
        dispatch(handleLoadings({resetPasswordLoading:false}))
          dispatch(handleSnackBar({
            type:'success',
            open:true,
            msg:'Password changed'
        }))
        signUserIn(user.data.token,dispatch)

    } catch (error) {
        dispatch(handleLoadings({resetPasswordLoading:false}))
        console.log(error.response)
      handleError(error,dispatch)
       
     
    
    }

    
}
export const forgotPassword = async(data,dispatch) => {
    dispatch(handleLoadings({forgotPasswordLoading:true}))
    
   
    try {
        const user = await axios.post("/api/auth/forgotpassword",data)
        console.log(user)
        dispatch(handleLoadings({forgotPasswordLoading:false}))
        dispatch(handleSnackBar({
          type:'success',
          open:true,
            msg:'Email sent'
        }))
          dispatch(handleSingleModals({forgotPassworModal:false}))


    } catch (error) {
        dispatch(handleLoadings({forgotPasswordLoading:false}))
        console.log(error.response)
      handleError(error,dispatch)
       
     
    
    }

    
}
export const uploadDp = async(file,dispatch) => {
    dispatch(handleLoadings({updateProfile:true}))
    dispatch(updateProfileSucces(false))
    dispatch(upploadFileProgress(null))
   
    try {
      const user = await axios.put(`/api/auth/uploadDp`,file,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: data => {
    
          dispatch(upploadFileProgress(Math.round((100 * data.loaded) / data.total)))
        },
      }
        )
      
       
        dispatch(handleUpdateUserProfile(user.data.data))
        dispatch(handleLoadings({updateProfile:false}))
        dispatch(updateProfileSucces(true))
        dispatch(handleSnackBar({
          type:'success',
          open:true,
            msg:'Profile Pics Uploaded'
        }))
        dispatch(upploadFileProgress(null))
       


    } catch (error) {
        dispatch(handleLoadings({updateProfile:false}))
        console.log(error.response)
        handleError(error,dispatch)
       
     
    
    }

    
}
export const updateProfile = async(state,dispatch) => {
    dispatch(handleLoadings({updateProfile:true}))
    dispatch(updateProfileSucces(false))
 
   
    try {
      const user = await axios.put(`/api/auth/updateProfile`,state)
      
       
        dispatch(handleUpdateUserProfile(user.data.data))
        dispatch(handleLoadings({updateProfile:false}))
        dispatch(updateProfileSucces(true))
        dispatch(handleSnackBar({
          type:'success',
          open:true,
            msg:'Profile Pics Uploaded'
        }))
    
       


    } catch (error) {
        dispatch(handleLoadings({updateProfile:false}))
        console.log(error.response)
        handleError(error,dispatch)
       
     
    
    }

    
}
export const deleteProfile = async(dispatch) => {
    dispatch(handleLoadings({updateProfile:true}))
    dispatch(deleteProfileSucces(false))
 
   
    try {
      const user = await axios.delete(`/api/auth/deleteProfile`)
      
       console.log(user)

        dispatch(handleLoadings({updateProfile:false}))
        dispatch(deleteProfileSucces(true))
        dispatch(handleSnackBar({
          type:'success',
          open:true,
            msg:'Profile Deleted'
        }))
    
       


    } catch (error) {
        dispatch(handleLoadings({updateProfile:false}))
        console.log(error.response)
        handleError(error,dispatch)
       
     
    
    }

    
}
export const getHome = async(dispatch) => {
  dispatch(isLoading(true))

    
   
    try {
        const user = await axios.get("/api/auth/getHome")
        console.log(user)
        dispatch(isLoading(false))
        dispatch({
          type:'GET_HOME',
          payload:user.data.data
        })


    } catch (error) {
      dispatch(isLoading(false))
        console.log(error.response)
      handleError(error,dispatch)
       
     
    
    }

    
}

