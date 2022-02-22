export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch (err) {
    return
  }
}

export const setUser = (user) => {
  try {
    return localStorage.setItem('user', JSON.stringify(user))
  } catch (err) {
    return
  }
}

export const logOut = () => {
  try {
    return localStorage.removeItem('user')
  } catch (err) {
    return
  }
}
