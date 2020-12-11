export default function isAdmin ({ next, store, to }) {
  console.log('admin')
  if (store.state.user.isAdmin) {
    return next()
  }
  return next({
    name: 'login',
  })
}
