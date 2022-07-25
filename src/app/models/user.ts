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
}