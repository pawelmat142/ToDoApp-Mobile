import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataRespone } from '../models/dataResponse';
import { Credentials, nUser, User } from '../models/user';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment'
import { IdService } from './id.service';


@Injectable({
  providedIn: 'root'
})
export class UsersOnlineService {

  // private url = 'http://localhost:3333'

  private url = 'https://todo.drawit.click/api'

  constructor(
    private http: HttpClient, 
    public storage: Storage,
    private id: IdService
  ) { }

  private headers = new HttpHeaders({ 'Authorization': '' })
  private token: string

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

    this.http.post<never>(this.url + '/register', body).subscribe(
      () => {
        dataRespone.state = true,
        dataRespone.message = 'Zarejestrowano'
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
          console.log('TODO: do implementacji na backendzie - usuwanie konta')
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
        dataRespone.message = 'Zalogowano'
        resolve(dataRespone)
      },
      (error) => {
        console.log(error)
        dataRespone.message = error.error.message
        resolve(dataRespone)
      }
    )
  })


  public setToken(token: string) {
    this.token = token
    this.headers = this.headers.set('Authorization', 'Bearer ' + token)
    this.storage.set(environment.loggedUsersToken, token)
  }

  resetToken() {
    this.token = ''
    this.headers = this.headers.set('Authorization', 'Bearer ' + '')
    this.storage.set(environment.loggedUsersToken, '')
  }


}
