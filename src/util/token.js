import decode from 'jwt-decode'

const TOKEN_KEY = 'SYS_TOKEN'

export const getToken = () => {
  return window.localStorage.getItem(TOKEN_KEY)
}

export const saveToken = (data) => {
  window.localStorage.setItem(TOKEN_KEY, data)
}

export const removeToken = () => {
  window.localStorage.removeItem(TOKEN_KEY)
}

export const decodeToken = () => {
  return decode(window.localStorage.getItem(TOKEN_KEY))
}

export default { getToken, saveToken, removeToken, decodeToken }