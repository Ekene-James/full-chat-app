import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import { AuthContext } from '../store/auth/AuthStore';
import jwt_decode from 'jwt-decode'

import setAuthToken from '../store/utils/setAuthToken';
import { logout, setCurrentUser } from '../store/auth/AuthActions';
const useAuth=()=>{
    const user=localStorage.getItem('user')
        //set req header to dt token
      
    if(user){
        const {token} = JSON.parse(localStorage.getItem('user'))
        setAuthToken(token);
        const currentTime = Date.now() / 1000;
        const decoded = jwt_decode(token);
        if (decoded.exp < currentTime) {
   
        return {
          isAuth:false,
          token:null
        }
      
       }
        if (!decoded.id) {
   
          return {
          isAuth:false,
          token:null
        }
      
       }
  
     
    
       return {
        isAuth:true,
        token
      }
    } else {
      return {
        isAuth:false,
        token:null
      }
    }
  }
function PublicRoutes() {

     const {isAuth,token}=useAuth();
     const {state,dispatch} = React.useContext(AuthContext);
     React.useLayoutEffect(() => {
        if (isAuth) {
               
          const decoded = jwt_decode(token);
          dispatch(setCurrentUser({...decoded}));
      }
      }, [])

    return isAuth ? <Navigate to="/chat"/>: <Outlet/>
  }


export default PublicRoutes
