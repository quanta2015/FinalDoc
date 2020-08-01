import decode from 'jwt-decode'


const TOKEN_KEY = 'SYS_TOKEN'
const USER_KEY  = 'FinalDoc_USER'

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

export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const saveUser = (data) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const removeUser = () => {
  console.log("删除本地用户信息")
  window.localStorage.removeItem(USER_KEY)
}


export default { getToken, saveToken, removeToken, decodeToken,getUser,saveUser,removeUser }