import { useState } from 'react'
import { supabase } from '../lib/supabase'

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
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setFormError('')
    setSuccessMessage('')
  }

  const toggleMode = () => {
    setIsLogin((prev) => !prev)
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

  const validate = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    return newErrors
  }

  const getErrorMessage = (error) => {
    const messages = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please verify your email address',
      'User already registered': 'An account with this email already exists',
      'Invalid email': 'Please enter a valid email address',
    }
    return messages[error.message] || error.message
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setFormError('')
    setSuccessMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        })

        if (error) throw error

        // Check if email confirmation is required
        if (data.user && !data.user.confirmed_at) {
          setSuccessMessage('Please check your email to confirm your account')
          // Reset form but don't switch to login
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          })
          return
        }

        // If no confirmation needed, switch to login
        setSuccessMessage('Account created successfully! Please log in.')
        setIsLogin(true)
        setFormData({
          name: '',
          email: formData.email, // Keep email for convenience
          password: '',
          confirmPassword: '',
        })
      }
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLogin,
    showPassword,
    showConfirmPassword,
    formData,
    errors,
    formError,
    successMessage,
    isLoading,
    handleChange,
    handleSubmit,
    toggleMode,
    setShowPassword,
    setShowConfirmPassword,
  }
}