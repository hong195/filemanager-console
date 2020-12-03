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

    if (payload.user.role && ['admin', 'Админ'].includes(payload.user.role.name)) {
      state.isAdmin = true
    }
  },
  setUser (state, payload) {
    state.currentUser = payload.user

    if (payload.user.role && ['admin', 'Админ'].includes(payload.user.role.name)) {
      state.isAdmin = true
    }
    // if (payload.user.permissions.length) {
    //   state.permissions = payload.user.permissions
    // }
  },
}
