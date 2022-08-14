import { Injectable } from '@angular/core';
import { nUser, User } from '../models/user';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment'
import { UsersService } from './users.service';
import { dataRespone } from '../models/dataResponse';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public storage: Storage,
    public router: Router,
    private usersService: UsersService
  ) { }


  private userObs = new BehaviorSubject<nUser>(null)
  private userSnapshot: nUser = null


  // triggered by app service
  public async initUser(user: nUser): Promise<void> { 
    this.userObs.next(user)
    this.userObs.subscribe(u => {
      this.userSnapshot = u
    })
  }


  public get user(): nUser {
    return this.userSnapshot
  }

  public get id(): string {
    return this.userSnapshot ? this.userSnapshot.id : ''
  }


  // LOGIN / LOGOUT

  public async login(userId: string): Promise<dataRespone> {
    const user = this.usersService.getUserById(userId)
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    if (!user) {
      result.message = 'Nie ma takiego użytkownika!'
      return result
    }
    await this.setUserData(user)
    result.state = true
    result.message = `Zalogowano: ${user.nickname}!`
    this.router.navigateByUrl('/tasks', { replaceUrl: true })
    return result
  }
  
  public async logout(): Promise<dataRespone> {
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    await this.setUserData(null)
    console.log(this.id)
    this.router.navigateByUrl('/users', { replaceUrl: true })
    return result
  }


  
  // STORAGE

  private get idKey(): string {
    return environment.loggedUsersKey
  }

  private async setUserData(user: nUser): Promise<void> {
    this.userObs.next(user)
    await this.storage.set(this.idKey, user? user.id : '')
  }

}
