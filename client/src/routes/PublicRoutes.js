import React from 'react'
import {Routes, Route,Navigate} from 'react-router-dom'
import Login from '../pages/login/Login'
import ResetPassword from '../pages/resetPassword/ResetPassword'
import SignUp from '../pages/signUp/SignUp'
function PublicRoutes() {
    return (
        <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='signup' element={<SignUp/>} />
            <Route path='resetpassword/:resetToken' element={<ResetPassword/>} />
         {  
              <Route
                path="*"
                element={<Navigate to="/login" replace />}
               
            />
        }
          
            </Routes>
    )
}

export default PublicRoutes
