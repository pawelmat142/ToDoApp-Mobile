import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment'
import { nUser } from '../models/user';
import { dataRespone } from '../models/dataResponse';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  constructor(
    public router: Router,
    public storage: Storage
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
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    if (this.userExists(user.nickname)) {
      result.message = 'Użytkownik o takim nicku już istnieje!'
      return result
    }
    const usersBefore = this.usersSnapshot
    const success = await this.setUsersData([...this.usersSnapshot, user] as nUser[])
    if (success) {
      result.state = true
      result.message = `Dodano użytkownika: ${user.nickname}!`
    } else { 
      result.message = `Błąd dodawania użytkownika`
      this.setUsersData(usersBefore)
    }
    return result
  }

  
  public async deleteUser(index: number) { 
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    const deletedUser = this.usersSnapshot.splice(index, 1)
    if (deletedUser.length) {
      result.state = true
      result.message = 'Usunięto!'
      this.setUsersData(this.usersSnapshot)
    } else { 
      result.message = 'Nic nie usunięto'
    }
    return result
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
      console.log('set users data error:')
      console.log(err.message)
      this.usersObs.next(usersPrev)
      return false
    }
  }
  

  // OTHERS

  private userExists = (nickname: string): boolean => {
    console.log(this.usersSnapshot)
    return !!this.usersSnapshot.find(n => n.nickname === nickname)
  }

}

