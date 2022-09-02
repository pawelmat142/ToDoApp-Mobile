export interface User {
  id?: string
  nickname: string
  password: string
}

export interface nUser {
  id?: string
  nickname: string
  password: string
  logged: boolean
  online: boolean
  token?: string
}

export interface Credentials {
  nickname: string,
  password: string
}