
import React ,{createContext} from 'react';
import { AuthReducer } from './AuthReducer';

export const AuthContext = createContext();

export default function AuthContextProvider (props){
 const initialState ={
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
 const [state, dispatch] = React.useReducer(AuthReducer, initialState);


const value ={
state,
dispatch
}
    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}