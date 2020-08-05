export default function isLoggedIn ({ next, store, to }) {
  if (!store.state.user.isLoggedIn) {
    return next({
      name: 'login',
    })
  }
  return next()
}
