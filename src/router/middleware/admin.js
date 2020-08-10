export default function isAdmin ({ next, store, to }) {
  if (store.state.user.isAdmin) {
    return next()
  }
  return next({
    name: 'login',
  })
}
