import axios from 'axios'

export default {
  fetchLanguages ({ commit, dispatch }) {
    return axios.get('locales')
      .then(({ data }) => {
        commit('setLanguages', data)
        // dispatch('fetchMessages')
        commit('removePreloader', null, { root: true })
      })
  },
  fetchMessages ({ commit }) {
    return axios.get('translations')
      .then(({ data }) => {
        commit('setTranslations', data)
        commit('removePreloader', null, { root: true })
      })
  },
}
