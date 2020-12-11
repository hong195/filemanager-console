export default function isLoggedIn ({ next, store, to }) {
  console.log('user')
  if (!store.state.user.isLoggedIn) {
    return next({
      name: 'login',
    })
  }
  return next()
}
