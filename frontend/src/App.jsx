import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message,setMessage] = useState('')
  useEffect(()=>{
    const fetchdata = async()=>{
      try{
        const response = await axios.get('http://127.0.0.1:8000/api/test/')
        setMessage(response.data.message)
      }catch{
        console.log("Error ocuured")
      }
    }
    fetchdata()
  },[]) 
  
  return (
    <>
    <h1 className='text-red-500 text-3xl text-center'>{message}</h1>
    </>
  )

}

export default App
