import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import RoleSelection from './Pages/Users/RoleSelection'
import Signup from './Pages/Users/Signup'


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
        <Route path='/' element={<RoleSelection/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </Router>
  )

}

export default App
