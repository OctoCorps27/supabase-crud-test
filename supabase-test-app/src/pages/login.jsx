import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Slide,
  Fade,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Login as LoginIcon,
  PersonAdd,
} from '@mui/icons-material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginForm } from '../hooks/useLoginForm'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
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
    handleClickShowPassword,
    handleClickShowConfirmPassword,
  } = useLoginForm()

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Fade in timeout={500}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  bgcolor: 'grey.100',
                  borderRadius: 4,
                  p: 0.5,
                  mb: 3,
                }}
              >
                <Button
                  variant={isLogin ? 'contained' : 'text'}
                  onClick={() => isLogin || toggleMode()}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    color: isLogin ? 'white' : 'text.primary',
                  }}
                >
                  Login
                </Button>
                <Button
                  variant={!isLogin ? 'contained' : 'text'}
                  onClick={() => !isLogin || toggleMode()}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    color: !isLogin ? 'white' : 'text.primary',
                  }}
                >
                  Sign Up
                </Button>
              </Box>

              <Typography variant="h5" component="h1" gutterBottom>
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLogin
                  ? 'Please enter your details to sign in'
                  : 'Please fill in the information below'}
              </Typography>
            </Box>

            {/* Error Message */}
            {formError && (
              <Slide direction="down" in={!!formError}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              </Slide>
            )}

            {/* Success Message */}
            {successMessage && (
              <Slide direction="down" in={!!successMessage}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
              </Slide>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {!isLogin && (
                <Fade in={!isLogin}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    margin="normal"
                    autoComplete="name"
                    autoFocus={!isLogin}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Fade>
              )}

              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                autoComplete="email"
                autoFocus={isLogin}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {!isLogin && (
                <Fade in={!isLogin}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    margin="normal"
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Fade>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={isLogin ? <LoginIcon /> : <PersonAdd />}
                sx={{
                  mt: 3,
                  py: 1.5,
                }}
              >
                {isLoading
                  ? isLogin
                    ? 'Signing in...'
                    : 'Creating account...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
              </Button>

              {!isLogin && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', textAlign: 'center', mt: 2 }}
                >
                  By signing up, you agree to our{' '}
                  <Link href="#" underline="hover">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" underline="hover">
                    Privacy Policy
                  </Link>
                </Typography>
              )}
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  )
}

export default Login