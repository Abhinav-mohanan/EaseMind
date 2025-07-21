import React, { useState } from 'react'
import VerifyOTP from '../../Components/Users/VerifyOTP'
import { useLocation } from 'react-router-dom'

// validate email after signup
const EmailVerification = () => {
    const location = useLocation()
    const email = location.state.email || ''
  return (
    <VerifyOTP
    initialEmail={email}
    purpose='email_verification'
    description='Enter the OTP sent to your email to verify your account'/>
  )
}

export default EmailVerification