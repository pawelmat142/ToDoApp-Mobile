import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment'
import { nUser } from '../models/user';
import { dataRespone } from '../models/dataResponse';
import { Router } from '@angular/router';


import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // stores list of users loaded to device
  private usersObs = new BehaviorSubject<nUser[]>([])
  private usersSnapshot: nUser[] = []
  
  constructor(
    public router: Router,
    public storage: Storage,
  ) { 
    if (dev) console.log('usersService constructor')

    this.usersObs.subscribe(u => {
      this.usersSnapshot = u ? u : []
      if (dev) console.log('users subscibing: ' + this.usersSnapshot.length)
    })
  }
  

  // INIT TRIGGERED BY APP SERVICE
  public async initUsers(): Promise<void> {
    if (dev) console.log('init USERS')
    await this.loadUsers()
  }


  public get users(): nUser[] {
    return this.usersSnapshot 
  }
  
  public getUsersObs(): Observable<nUser[]> {
    return this.usersObs.asObservable()
  }

  public getUserById(id: string): nUser {
    const user = this.usersSnapshot.find(u => u.id === id)
    return user? user : null
  }


  public async addOnlineExistingUser(user: nUser): Promise<dataRespone> {
    if (this.userExists(user.nickname)) {
      return { state: false, message: 'Użytkownik o takim nicku już istnieje!' }
    }
    const usersBefore = this.usersSnapshot
    const success = await this.setUsersToStorage([...this.usersSnapshot, user] as nUser[])

    if (success) return { state: true, message: `Dodano użytkownika: ${user.nickname}!`}
    else {
      this.setUsersToStorage(usersBefore)
      return { state: false, message: 'Błąd zapisu do bazy!'}
    }
  }


  public async addNewUser(newUser: nUser): Promise<boolean> {
    const usersBefore = this.usersSnapshot
    const success = await this.setUsersToStorage([...this.usersSnapshot, newUser] as nUser[])
    if (success) return true
    else {
      this.setUsersToStorage(usersBefore)
      return false
    }
  }


  public async removeUserToken(userId: string) {
    this.usersSnapshot.find(u => u.id === userId)['token'] = ''
    this.setUsersToStorage(this.usersSnapshot)
  }
    

  // STORAGE STAFF

  public async deleteUserInStorage(id: string): Promise<boolean> {
    const user = copy(this.getUserById(id))
    const index = this.usersSnapshot.findIndex(u => u.id === id)
    const deletedUser = this.usersSnapshot.splice(index, 1)
    if (deletedUser.length) {
      await this.setUsersToStorage(this.usersSnapshot)
      await this.storage.remove(`${this.key}_${id}_tasks`)
      await this.storage.remove(`${this.key}_${id}_notes`)
      return true
    } 
    return false
  }


  private get key(): string {
    return environment.dataUsersKey
  }

  private async loadUsers(): Promise<void> {
    const users = await this.storage.get(environment.dataUsersKey) as nUser[] || null
    this.usersObs.next(users)
  }

  private async resetUsers(): Promise<void> {
    await this.storage.remove(environment.dataUsersKey)
    this.usersObs.next(null)
  }

  private async setUsersToStorage(users: nUser[]): Promise<boolean> {
    const usersPrev = this.usersSnapshot
    this.usersObs.next(users)
    try {
      await this.storage.set(this.key, users)
      return true
    } catch (error) {
      if (dev) console.log(error)
      this.usersObs.next(usersPrev)
      return false
    }
  }


  // OTHERS

  private user = (nickname: string): nUser => {
    return this.usersSnapshot.find(u => u.nickname === nickname)
  }

  private userExists = (nickname: string): boolean => {
    return !!this.usersSnapshot.find(n => n.nickname === nickname)
  }

}

const copy = (item: any) => JSON.parse(JSON.stringify(item))

 