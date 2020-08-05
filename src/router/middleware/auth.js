export default function isLoggedIn ({ next, store, to }) {
  if (!store.state.user.isLoggedIn) {
    return next('/page/login')
  }

  return next()
}
