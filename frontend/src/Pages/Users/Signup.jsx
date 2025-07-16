import React, { useEffect } from 'react'
import AuthForm from '../../Components/Users/AuthForm'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate()
    const role = useSelector((state) => state.role.selectedRole)
    useEffect(() => {
        if (!role) {
        navigate('/')
        }
    }, [role, navigate])
    
    const fields = [
        {name:"first_name",type:"text",placeholder:"Enter your First Name"},
        {name:"last_name",type:"text",placeholder:"Enter your Last Name"},
        {name:"email",type:"email",placeholder:"Enter your Email"},
        {name:"phone_number",type:"tel",placeholder:"Enter your PhoneNumber"},
        {name:"password",type:"password",placeholder:"Enter your Password"},
        {name:"confirm_password",type:"password",placeholder:"Confirm password"},

    ]

  return (
    <AuthForm  role={role} type='signup' fields={fields}/>
  )
}

export default Signup