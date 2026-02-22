import { useState } from 'react'

export const useLoginForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
    // Clear general errors
    setFormError('')
    setSuccessMessage('')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    setErrors({})
    setFormError('')
    setSuccessMessage('')
  }

  const validateLogin = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    return newErrors
  }

  const validateSignup = () => {
    const newErrors = {}
    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = isLogin ? validateLogin() : validateSignup()
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      setFormError('')
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (isLogin) {
          // Login logic
          if (formData.email === 'test@example.com' && formData.password === 'password123') {
            setSuccessMessage('Login successful! Redirecting...')
            console.log('Login successful:', formData.email)
            // Handle successful login here
          } else {
            throw new Error('Invalid email or password')
          }
        } else {
          // Sign up logic
          console.log('Sign up successful:', formData)
          setSuccessMessage('Account created successfully! You can now log in.')
          // Automatically switch to login after successful signup
          setTimeout(() => {
            setIsLogin(true)
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            })
            setSuccessMessage('')
          }, 2000)
        }
      } catch (error) {
        setFormError(error.message)
      } finally {
        setIsLoading(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  return {
    // State
    isLogin,
    showPassword,
    showConfirmPassword,
    formData,
    errors,
    formError,
    successMessage,
    isLoading,
    
    // Handlers
    handleChange,
    handleSubmit,
    toggleMode,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
  }
}