import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import RoleSelection from './Pages/Users/RoleSelection'
import Signup from './Pages/Users/Signup'
import EmailVerification from './Pages/Users/EmailVerification'
import Login from './Pages/Users/Login'
import Home from './Pages/Users/Home'


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
        <Route path='/roleSelection' element={<RoleSelection/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/verify-otp' element={<EmailVerification/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </Router>
  )

}

export default App
