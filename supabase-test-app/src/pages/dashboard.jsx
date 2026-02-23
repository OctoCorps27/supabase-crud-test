import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()

  const displayName = user?.user_metadata?.name || 'User'
  
  // Format the created_at date from auth user
  const createdDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A'

  // ✅ FIXED: Create a handler function that CALLS logout
  const handleLogout = async () => {
    try {
      await logout()
      // The navigation happens in the logout function, but you can also do it here
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Dashboard</h1>
        <button 
          onClick={handleLogout}  
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      
      <h2>Welcome, {displayName}! 👋</h2>
      
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3>Your Information</h3>
        <p><strong>Name:</strong> {user?.user_metadata?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Member since:</strong> {createdDate}</p>
        <p><strong>Last Sign In:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}</p>
      </div>
    </div>
  )
}

export default Dashboard