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
import AdminLogin from './Pages/Admin/AdminLogin'
import PublishedArticles from './Pages/Users/PublishedArticles'
import ArticleDetails from './Pages/Users/ArticleDetails'
import PsychologistsList from './Pages/Users/Psychologists'
import PsychologistDetail from './Pages/Users/User/PsychologistDetail'
import Chatpage from './Pages/Users/Chatpage'
import VideoCall from './Pages/Users/VideoCall'
import AdminRoutes from './Routes/AdminRoutes'
import ProtectedRoute from './Routes/ProtectedRoute'
import UserRoutes from './Routes/UserRoutes'
import PsychologistRoutes from './Routes/PsychologistRoutes'
import NotFound from './Pages/Users/NotFound'
import PublicRoute from './Routes/PublicRoute'


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
        <Route element={<PublicRoute /> }>
        <Route path='/roleSelection' element={<RoleSelection />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-otp' element={<EmailVerification />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/resetpassword/email-verify' element={<ResetPasswordEmailverification />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        </Route>

        <Route path='/' element={<Home />} />
        <Route path='/articles' element={<PublishedArticles />} />
        <Route path='/article/detail/:article_id' element={<ArticleDetails />} />
        <Route path='/therapist' element={<PsychologistsList />} />
        <Route path='/therapist/details/:psychologist_id' element={<PsychologistDetail />} />
        <Route path='/chat' element={<Chatpage />} />
        <Route path='/video-call/:appointment_id' element={<VideoCall />} />    

        <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin']}/>}>
          {AdminRoutes}
        </Route> 

        <Route path='user' element={<ProtectedRoute allowedRoles={['user']}/>}>
          {UserRoutes}
        </Route> 

        <Route path='psychologist' element={<ProtectedRoute allowedRoles={['psychologist']}/>}>
          {PsychologistRoutes}
        </Route>  

        <Route path='*' element={<NotFound />}></Route>

      </Routes>
    </Router>
  );
}

export default App;
