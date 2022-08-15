import { Injectable } from '@angular/core';
import { nUser } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment'
import { UsersService } from './users.service';
import { dataRespone } from '../models/dataResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // stores current logged user
  private userObs = new BehaviorSubject<nUser>(null)
  private userSnapshot: nUser = null

  constructor(
    private usersService: UsersService,
    public storage: Storage,
    private http: HttpClient,
  ) {
    if (dev) console.log('userService constructor')

    this.userObs.subscribe(u => {
      this.userSnapshot = u
      if (dev) console.log('user subscribing: ' + this.userSnapshot)
    })

  }

  // INIT TRIGGERED BY APP SERVICE
  public async initUser(): Promise<boolean> {
    if (dev) console.log('init USER')
    const success = await this.loadCurrentUser()
    if (!success) return false
    return true
  }


  // STORAGE STAFF

  public get user(): nUser {
    return this.userSnapshot
  }

  public get id(): string {
    return this.userSnapshot ? this.userSnapshot.id : ''
  }

  public getUserObs(): Observable<nUser> {
    return this.userObs.asObservable()
  }

  private async loadCurrentUser(): Promise<boolean> {
    let result = true
    const currentUserId = await this.storage.get(environment.currentUserKey) as string || null
    if (currentUserId) {
      this.userObs.next(this.usersService.getUserById(currentUserId))
    } else result = false

    const loginResult = await this.loginIfUserIsOnline()
    if (!loginResult) result = false

    if (!result) await this.resetCurrentUser()
    return result
  }


  public async chooseUser(userId: string): Promise<dataRespone> {
    let result = {state: true, message: 'Zalogowano!'}

    try {
      let user = this.usersService.getUserById(userId)
      if (user) {
        await this.storage.set(environment.currentUserKey, user.id)
        this.userObs.next(user)
      } else throw new Error('Problem z pamięcią')

      const loginResult = await this.loginIfUserIsOnline()
      if (!loginResult) throw new Error('Problem z logowaniem!')
    } 
    catch (error) {
      result = { state: false, message: error.message}
      await this.resetCurrentUser()
    }
    return result
  }


  public async resetCurrentUser(): Promise<void> {
    if (dev) console.log('resetCurrentUser')
    await this.storage.set(environment.currentUserKey, '')
    await this.resetToken()
    this.userObs.next(null)
  }


  // ONLINE STAFF

  public offlineMode: boolean = false

  private url = environment.apiUrl

  private headers = new HttpHeaders({ 'Authorization': '' })

  public get token(): string {
    return this.userSnapshot ? this.userSnapshot.token : ''
  }

  public get online(): boolean {
    return this.userSnapshot ? this.userSnapshot.online : false
  }


  private async loginIfUserIsOnline(): Promise<boolean> {
    if (this.userSnapshot?.online) {
      try {
        await this.loginCurrentUserOrSetOfflineMode()
        if (dev && this.offlineMode) console.log('USER OFFLINE MODE')
        return true
      } catch (error) { return false }
    } else return true
  }


  private async loginCurrentUserOrSetOfflineMode(): Promise<void> {
    if (dev) console.log('loginCurrentUserOrSetOfflineMode')
    let success = await this.loginCurrentUser()
    if (!success) {
      this.offlineMode = await this.alertLoginFailScenario()
      if (!this.offlineMode) await this.loginCurrentUserOrSetOfflineMode()
    }
  }

  
  private loginCurrentUser = () => new Promise<boolean>((resolve) => {
    this.http.post<any>(this.url + '/login', {
      nickname: this.userSnapshot.nickname,
      password: this.userSnapshot.password
    }).subscribe(
      (token) => {
        this.setToken(token)
        resolve(true)
      },
      (error) => resolve(false)
    )
  })


  private alertLoginFailScenario = () => new Promise<boolean>(async (resolve, reject) => {
    const alert = document.createElement('ion-alert');
    alert.header = 'Uwaga!';
    alert.subHeader = 'Użytkownik ' + this.userSnapshot.nickname;
    alert.message = 'Błąd logowania. Możesz przejść do trybu offline. Pamiętaj aby później zsynchronizować dane!';
    alert.cssClass = 'my-alert-wrapper';
    alert.buttons = [{
      text: 'Tryb offline',
      handler: () => resolve(true)
    },{
      text: 'Ponów próbę',
      handler: async () => resolve(false)
    },{
      text: 'Przejdź do listy użytkowników',
      handler: async () => reject()
    }];
    document.body.appendChild(alert);
    await alert.present();
  })


  // TOKEN

  public async setToken(token: string) {
    if (dev) console.log('setting token ' + token)
    this.headers = this.headers.set('Authorization', token? `Bearer ${token}` : '')
    await this.storage.set(environment.currentUserToken, token)
  }

  private async resetToken() {
    this.headers = this.headers.set('Authorization', '')
    await this.storage.set(environment.currentUserToken, '')
  }

  // OTHERS

}
