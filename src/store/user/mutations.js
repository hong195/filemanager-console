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
    state.isActive = true
    state.currentUser = payload.user
    state.token = payload.token
    localStorage.setItem('token', payload.token)
  },
  setUser (state, payload) {
    state.currentUser = payload.user
    state.isLoggedIn = true
    state.isActive = true

    if (payload.user.role && ['admin', 'Админ', 'manager'].includes(payload.user.role.name)) {
      state.isAdmin = true
    }
  },
}
