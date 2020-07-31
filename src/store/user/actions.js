import axios from 'axios'

export default {
  login ({ commit }, credentials) {
    return axios.post('auth/login', credentials)
      .then(({ data }) => {
        commit('authSuccess', data)
      })
      .catch((error) => {
        console.error(error)
        commit('authFailed')
      })
  },
  logOut ({ commit }) {
    return axios.post('auth/logout')
      .then(() => {
        commit('authFailed')
      })
      .catch((error) => {
        console.error(error)
      })
  },
  register ({ commit }, credentials) {
    return axios.post('auth/register', credentials)
      .then(({ data }) => {
        commit('authSuccess', data)
      })
      .catch((error) => {
        console.error(error)
        commit('authFailed')
      })
  },
  me ({ commit, state }) {
    const token = localStorage.getItem('token')
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }
    return axios.post('auth/me', '', config)
      .then(({ data }) => {
        commit('authSuccess', data)
        return Promise.resolve(data)
      })
      .catch((error) => {
        commit('authFailed')
        return Promise.reject(error)
      })
  },
}
