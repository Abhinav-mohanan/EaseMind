import React from 'react'
import { useLocation } from 'react-router-dom'
import VerifyOTP from '../../Components/Users/VerifyOTP'

const ResetPasswordEmailverification = () => {
    const location = useLocation()
    const email = location.state.email || ''
  return (
    <VerifyOTP
    initialEmail={email}
    purpose='password_reset'
    description="Enter the OTP sent to your email to Reset your password"/>
  )
}

export default ResetPasswordEmailverification