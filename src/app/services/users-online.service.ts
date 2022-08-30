import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataRespone } from '../models/dataResponse';
import { Credentials, nUser, User } from '../models/user';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment'
import { IdService } from './id.service';
import { BehaviorSubject, Observable } from 'rxjs';

import { isDevMode } from '@angular/core';
const dev = isDevMode() ? true : false


@Injectable({
  providedIn: 'root'
})
export class UsersOnlineService {

  private url = environment.apiUrl

  constructor(
    private http: HttpClient, 
    public storage: Storage,
    private id: IdService
  ) { }


  // TOKEN
 
  private tokenObs = new BehaviorSubject<string>('')

  private headers = new HttpHeaders({ 'Authorization': '' })

  public getTokenObs(): Observable<string> {
    return this.tokenObs.asObservable()
  }

  private setToken(token: string) {
    if (dev && token) console.log('setting token')
    this.tokenObs.next(token)
    this.headers = this.headers.set('Authorization', 'Bearer ' + token)
    this.storage.set(environment.currentUserToken, token)
  }

  resetToken() {
    this.tokenObs.next('')
    this.headers = this.headers.set('Authorization', 'Bearer ' + '')
    this.storage.set(environment.currentUserToken, '')
  }


  // ENDPOINTS

  addUser = (user: User) => new Promise<dataRespone>((resolve) => {
    let dataRespone: dataRespone = {
      state: false,
      message: 'Nieznany bład (online)'
    }

    const body = {
      id: this.id.generate(),
      nickname: user.nickname,
      password: user.password,
      confirmPassword: user.password
    }

    this.http.post<never>(this.url + '/register', body, {observe: 'response'}).subscribe(
      (res) => {
        dataRespone.state = true,
        dataRespone.message = res.headers.get('X-Custom-Header')
        resolve(dataRespone)
      },
      (error) => {
        dataRespone.message = error.error.message
        resolve(dataRespone)
      }
    )
  })

  async deleteUser(user: nUser) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Uwaga!';
    alert.subHeader = user.nickname;
    alert.message = 'Czy chcesz usunac kontro trwale(w sieci)? Twoje dane przepadną bezpowrotnie';
    alert.cssClass = 'my-alert-wrapper';
    alert.buttons = [{
        text: 'Nie',
        role: 'cancel',
      },{
        text: 'Tak',
        role: 'confirm',
        handler: () => {
          if (dev) console.log('TODO: do implementacji na backendzie - usuwanie konta')
        }
      }];
    document.body.appendChild(alert);
    await alert.present();
  }


  login = (credentials: Credentials) => new Promise<dataRespone>((resolve,reject) => {
    let dataRespone: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }

    this.http.post<any>(this.url + '/login', credentials).subscribe(
      (token) => {
        this.setToken(token)
        dataRespone.state = true
        dataRespone.message = token
        resolve(dataRespone)
      },
      (error) => {
        if (dev) console.log(error)
        dataRespone.message = error.error.message
        resolve(dataRespone)
      }
    )
  })


  


}
