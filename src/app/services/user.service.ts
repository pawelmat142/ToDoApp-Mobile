import { Injectable } from '@angular/core';
import { Credentials, nUser, User } from '../models/user';
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

  private userObs = new BehaviorSubject<nUser>(null)
  private userSnapshot: nUser = null

  constructor(
    public storage: Storage,
    public router: Router,
    private usersService: UsersService,
  ) {
    this.userObs.subscribe(u => {
      this.userSnapshot = u
      console.log('user subscribe')
    })
  }

  public logged: boolean = false

  // triggered by app service
  public async initUser(user: nUser): Promise<void> {
    if (user?.online) {
      const token = await this.storage.get(environment.loggedUsersToken) as string || ''
      if (!token) console.log('TODO: user sie inicjalizuje ale nie ma tokena!')
      user.token = token
    }
    this.userObs.next(user)
    this.login()
  }


  public get user(): nUser {
    return this.userSnapshot
  }

  public get id(): string {
    return this.userSnapshot ? this.userSnapshot.id : ''
  }

  public get token(): string {
    return this.userSnapshot ? this.userSnapshot.token : ''
  }

  public get online(): boolean {
    return this.userSnapshot ? this.userSnapshot.online : false
  }


  // LOGIN / LOGOUT

  public async setUser(userId: string): Promise<dataRespone> {
    const user = this.usersService.getUserById(userId)
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    if (!user) {
      result.message = 'Nie ma takiego użytkownika'
      return result
    }

    await this.setUserData(user)
    this.login()
    return result
  }

  
  public async logout(): Promise<dataRespone> {
    this.usersService.resetToken()
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    await this.setUserData(null)
    this.router.navigateByUrl('/users', { replaceUrl: true })
    return result
  }


  
  // STORAGE

  private get idKey(): string {
    return environment.loggedUsersKey
  }

  private async setUserData(user: nUser): Promise<void> {
    this.router.navigateByUrl('/tasks', { replaceUrl: true })
    this.userObs.next(user)
    await this.storage.set(this.idKey, user? user.id : '')
  }

  private async login () {
    if (this.user?.online) {
      if (!this.logged) {
        let result = await this.usersService.login({nickname: this.userSnapshot.nickname, password: this.userSnapshot.password})
        if (result.state) {
          this.logged = true
        } else {
          const alert = document.createElement('ion-alert');
          alert.header = 'Uwaga!';
          alert.subHeader = this.userSnapshot.nickname;
          alert.message = 'Błąd logowania. Możesz przejść do trybu offline. Pamiętaj aby później zsynchronizować dane!';
          alert.cssClass = 'my-alert-wrapper';
          alert.buttons = [{
              text: 'Tryb offline',
              role: 'cancel',
            },{
              text: 'Ponów próbę',
              role: 'confirm',
              handler: () => this.login()
            }];
          document.body.appendChild(alert);
          await alert.present();
        }
      }
    }
  }

}
