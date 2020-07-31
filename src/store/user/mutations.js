export default {
  authFailed (state) {
    state.currentUser = null
    state.isLoggedIn = false
    state.isActive = false
    state.authError = true
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
  },
}
