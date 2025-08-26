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
import CreateArticle from './Pages/Users/Psychologist/CreateArticle'
import PublishedArticles from './Pages/Users/PublishedArticles'
import ArticleDetails from './Pages/Users/ArticleDetails'
import ArticlesManage from './Pages/Admin/ArticlesManage'
import PsychologistAvailability from './Pages/Users/Psychologist/PsychologistAvailability'
import PsychologistsList from './Pages/Users/Psychologists'
import PsychologistDetail from './Pages/Users/User/PsychologistDetail'
import PsychologistAppointments from './Pages/Users/Psychologist/PsychologistAppointments'
import UserAppointments from './Pages/Users/User/UserAppointments'
import ViewAppointments from './Pages/Admin/ViewAppointments'
import UserAppointmentDetails from './Pages/Users/User/UserAppointmentDetails'
import PsychologistAppointmentDetails from './Pages/Users/Psychologist/PsychologistAppointmentDetails'
import WalletTransactionList from './Pages/Users/User/WalletTransactionList'
import Chatpage from './Pages/Users/Chatpage'
import VideoCall from './Pages/Users/VideoCall'


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
        <Route path='/psychologist/articles' element={<CreateArticle />} />
        <Route path='/psychologist/availability' element={<PsychologistAvailability />} />
        <Route path='/articles' element={<PublishedArticles />} />
        <Route path='/article/detail/:article_id' element={<ArticleDetails />} />
        <Route path='/admin/aritcles' element={<ArticlesManage />} />
        <Route path='/therapist' element={<PsychologistsList />} />
        <Route path='/therapist/details/:psychologist_id' element={<PsychologistDetail />} />
        <Route path='/psychologist/appointments' element={<PsychologistAppointments />} />
        <Route path='/user/appointments' element={<UserAppointments />} />
        <Route path='/admin/appointments' element={<ViewAppointments />} />
        <Route path='/user/appointment/:appointment_id' element={<UserAppointmentDetails />} />
        <Route path='/psychologist/appointment/:appointment_id' element={<PsychologistAppointmentDetails />} />
        <Route path='/wallet/transaction' element={<WalletTransactionList />} />
        <Route path='/chat' element={<Chatpage />} />
        <Route path='/video-call/:appointment_id' element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default App;
