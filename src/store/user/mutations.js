export default {
  authFailed (state) {
    state.currentUser = null
    state.isLoggedIn = false
    state.isActive = false
    state.authError = true
    state.isAdmin = false
    localStorage.removeItem('token')
  },
  authSuccess (state, payload) {
    state.authError = false
    state.isLoggedIn = true
    state.isActive = false
    state.currentUser = payload.user

    if (payload.access_token) {
      state.token = payload.access_token
      localStorage.setItem('token', payload.access_token)
    }
    if (payload.user.roles && payload.user.roles.includes('admin')) {
      state.isAdmin = true
    }
  },
}
