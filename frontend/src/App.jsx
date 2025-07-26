import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import RoleSelection from './Pages/Users/RoleSelection'
import Signup from './Pages/Users/Signup'
import EmailVerification from './Pages/Users/EmailVerification'
import Login from './Pages/Users/Login'
import Home from './Pages/Users/Home'
import ForgotPassword from './Pages/Users/ForgotPassword'
import ResetPasswordEmailverification from './Pages/Users/ResetPasswordEmailverification'
import ResetPassword from './Pages/Users/ResetPassword'
import UserProfile from './Pages/Users/User/UserProfile'
import PsychologistProfile from './Pages/Users/Psychologist/PsychologistProfile'
import AdminLogin from './Pages/Admin/AdminLogin'
import ManageUser from './Pages/Admin/ManageUser'
import ManagePsychologist from './Pages/Admin/ManagePsychologist'
import PsychologistVerification from './Pages/Admin/PsychologistVerification'


function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path='/roleSelection' element={<RoleSelection />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-otp' element={<EmailVerification />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/resetpassword/email-verify' element={<ResetPasswordEmailverification />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/user/profile' element={<UserProfile />} />
        <Route path='/psychologist/profile' element={<PsychologistProfile />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/user/management' element={<ManageUser />} />
        <Route path='/admin/psychologist/management' element={<ManagePsychologist />} />
        <Route path='/admin/psychologist/verification' element={<PsychologistVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
