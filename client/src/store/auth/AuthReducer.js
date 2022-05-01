export const AuthReducer = (state, action) => {
    switch(action.type){
        case "LOADING" : 
        return {
            ...state,
            loading: action.payload
           
          };
          case "HANDLE_SNACK_BAR" : 
          return {
              ...state,
              snackBarObj: action.payload
             
            };
          case "SINGLE_MODALS" : 
          return {
              ...state,
              singleModals:{
                  ...state.singleModals,
                  ...action.payload
              }
             
            };
          case "LOADINGS" : 
          return {
              ...state,
              loadings:{
                  ...state.loadings,
                  ...action.payload
              }
             
            };
          case "HANDLE_ERRORS" : 
          return {
              ...state,
              errors: action.payload
             
            };
        case "LOGIN" : 
        return {
            ...state,
            isAuthenticated: true,
            user: action.payload
           
          };
        case "UPDATE_PROFILE_SUCCESS" : 
        return {
            ...state,
            updateProfileSucess : action.payload,
           
          };
        case "DELETE_PROFILE_SUCCESS" : 
        return {
            ...state,
            deleteProfileSucess : action.payload,
           
          };
        case "UPLOAD_FILE_PROGRESS" : 
        return {
            ...state,
            fileProgress : action.payload,
           
          };
        case "HANDLE_UPDATE_USER_PROFILE" : 
        return {
            ...state,
            home:{
              user: {...state.home.user,...action.payload}
            }
           
          };
        case "GET_HOME" : 
        return {
            ...state,
            home: action.payload
           
          };
        case "RECEIVER_PROFILE" : 
        return {
            ...state,
            receiverProfile: action.payload
           
          };
        case "LOGOUT" : 
        return {
            isAuthenticated : false,
            updateProfileSucess : false,
            deleteProfileSucess : false,
            fileProgress : null,
            home : {
                user:{},
                users:[]
            },
            user: {},
            receiverProfile: {},
            loading:false,
            chatWindow:false,
            chattingWith:{},
            snackBarObj:{
                type:'success',
                open:false,
                msg:''
            },
            singleModals:{
              forgotPassworModal:false,
                deleteProfileModal:false
            },
            loadings:{
              forgotPasswordLoading:false,
              resetPasswordLoading:false,
              updateProfile:false,
            },
            errors:{
                isError:false,
                errorArr:[]
            }
          };
        case "ROUTE" : 
        return {
            ...state,
            route : action.payload
        };
        case "CHAT_WINDOW" : 
        return {
            ...state,
            chatWindow : action.payload
        };
        case "CHATTING_WITH" : 
        return {
            ...state,
            chattingWith : action.payload
        };
        default : return state
    };

}