import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment'
import { Credentials, nUser, User } from '../models/user';
import { dataRespone } from '../models/dataResponse';
import { Router } from '@angular/router';
import { UsersOnlineService } from './users-online.service';
import { IdService } from './id.service';
import jwt_decode from 'jwt-decode';

import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  constructor(
    public router: Router,
    public storage: Storage,
    private usersOnline: UsersOnlineService,
    private id: IdService
  ) { }
  
  private usersObs = new BehaviorSubject<nUser[]>([])
  private usersSnapshot: nUser[] = []

  // triggered by app service
  public async initUsers(users: nUser[]): Promise<void> {
    this.usersObs.next(users)
    this.usersObs.subscribe(u => {
      this.usersSnapshot = u ? u : []
    })
  }


  get users(): nUser[] {
    return this.usersSnapshot 
  }
  
  public get(): Observable<nUser[]> {
    return this.usersObs.asObservable()
  }

  public getUserById(id: string): nUser {
    const user = this.usersSnapshot.find(u => u.id === id)
    return user? user : null
  }


  public async addUser(user: nUser): Promise<dataRespone> {
    console.log('add user')
    console.log(user)
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }

    if (this.userExists(user.nickname)) {
      result.message = 'Użytkownik o takim nicku już istnieje!'
      return result
    }

    if (user.online) {
      const result = await this.usersOnline.addUser(user)
      if (!result.state) { return result }
      user.id = result.message
    } else {
      user.id = this.id.generate()
    }

    const usersBefore = this.usersSnapshot
    const success = await this.setUsersData([...this.usersSnapshot, user] as nUser[])

    if (success) {
      result.state = true
      result.message = `Dodano użytkownika: ${user.nickname}!`
    } else {
      result.state = false
      result.message = `Błąd dodawania użytkownika`
      this.setUsersData(usersBefore)
    }
    return result
  }

  
  public async deleteUser(id: string) {
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    const user = copy(this.getUserById(id))
    const index = this.usersSnapshot.findIndex(u => u.id === id)
    const deletedUser = this.usersSnapshot.splice(index, 1)
    if (deletedUser.length) {
      result.state = true
      result.message = 'Usunięto!'
      await this.setUsersData(this.usersSnapshot)
      await this.storage.remove(`${this.key}_${id}_tasks`)
      await this.storage.remove(`${this.key}_${id}_notes`)
      if (user.online) {
        this.usersOnline.deleteUser(user)
      }
    } else { 
      result.message = 'Nic nie usunięto'
    }
    return result
  }


  public async login(credentials: Credentials): Promise<dataRespone> {
    let dataRespone = await this.usersOnline.login(credentials)
    if (!dataRespone.state) return dataRespone

    const token = dataRespone.message
    const userId = jwt_decode(token)['id']
    dataRespone.message = 'Zalogowano!'

    const userExists = this.user(credentials.nickname)

    if (userExists) {
      dataRespone.message = userExists.id
      return dataRespone
    }
    else {
      return await this.addExistUserToStorage(credentials, token, userId)
    }
  }


  // STORAGE

  private get key(): string {
    return environment.dataUsersKey
  }
  
  private async setUsersData(users: nUser[]): Promise<boolean> {
    const usersPrev = this.usersSnapshot
    this.usersObs.next(users)
    try {
      await this.storage.set(this.key, users)
      return true
    } catch (err) {
      if (dev) console.log('set users data error:')
      this.usersObs.next(usersPrev)
      return false
    }
  }

  private async addExistUserToStorage(credentials: Credentials, token: string, userId: string) {
    if (dev) console.log('addExistUserToStorage')
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }

    const user: nUser = {
      id: userId,
      nickname: credentials.nickname,
      password: credentials.password,
      online: true,
      logged: false,
      token: token
    }

    const usersBefore = this.usersSnapshot
    const success = await this.setUsersData([...this.usersSnapshot, user] as nUser[])

    if (success) {
      result.state = true
      result.message = userId
    } else {
      result.state = false
      result.message = `Błąd dodawania użytkownika`
      this.setUsersData(usersBefore)
    }
    return result
  }
  

  // OTHERS

  private user = (nickname: string): nUser => {
    return this.usersSnapshot.find(u => u.nickname === nickname)
  }

  private userExists = (nickname: string): boolean => {
    return !!this.usersSnapshot.find(n => n.nickname === nickname)
  }

  resetToken() {
    this.usersOnline.resetToken()
  }

}

const copy = (item: any) => JSON.parse(JSON.stringify(item))

 