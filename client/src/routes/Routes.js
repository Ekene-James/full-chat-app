import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom';

import PublicRoutes from './PublicRoutes';
import { AuthContext } from '../store/auth/AuthStore';
import jwt_decode from 'jwt-decode'

import setAuthToken from '../store/utils/setAuthToken';
import { logout, setCurrentUser } from '../store/auth/AuthActions';

import ChatRoutes from './ChatRoutes';

function Routes() {
    const {state,dispatch} = React.useContext(AuthContext);
    React.useLayoutEffect(() => {
    
             //to make sure d user stays loged in after pg refresh & also logout user after d token expires
            if (localStorage.user) {
                
                //set req header to dt token
                const {token} = JSON.parse(localStorage.getItem('user'))
                setAuthToken(token);
                const decoded = jwt_decode(token);
                //
                //dispatch setcurrentuser function wic passes decoded as payload to store nd set it as stores 'user' state
                dispatch(setCurrentUser({...decoded}));

                //logout user after code expiration
                const currentTime = Date.now() / 1000;
            
                if (decoded.exp < currentTime) {
                    dispatch(logout());
                //set profile state to null in d reducer by dispatching an action to it
                //
                //redirect to login
                window.location.href = "/login";
                }
            }
       
    }, [])


   
    return (
       <Router>
           {
               state.isAuthenticated ? (<ChatRoutes/>) : (<PublicRoutes/>)
           }
           
       </Router>
    )
}

export default Routes
