import { Injectable } from '@angular/core';
import * as Cordovasqlitedriver from 'localforage-cordovasqlitedriver';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UsersService } from './users.service';
import { environment } from '../../environments/environment'
import { nUser } from '../models/user';
import { isDevMode } from '@angular/core'
const dev = isDevMode()


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private users: nUser[]

  private currentUser: nUser

  constructor(
    public router: Router,
    public storage: Storage,
    private usersService: UsersService,
    private userService: UserService,
  ) {
    if (dev) console.log('appService constructor')
    this.init()

    this.usersService.getUsersObs().subscribe(users => {
      this.users = users
    })

    this.userService.getUserObs().subscribe(user => {
      this.currentUser = user
    })


  }

  private async init() {
    await this.initStorage()
    if (dev) console.log('storage initialized')

    await this.initUsers()
    if (dev) console.log('users initialized')

    await this.initUser()
    if (dev) console.log('user initialized')

    await this.redirect()
  }

  private async initStorage() {
    await this.storage.defineDriver(Cordovasqlitedriver) 
    await this.storage.create()
  }

  private async initUsers() {
    await this.usersService.initUsers()
  }

  private async initUser() {
    await this.userService.initUser()
  }

  private async redirect() {
    if (this.currentUser) {
      if (dev) console.log(`user ${this.currentUser.nickname} loaded, redirect to tasks board`)
      this.router.navigateByUrl('/tasks', { replaceUrl: true })
    } else {
      if (dev) console.log(`no user logged, redirect to users page`)
      this.router.navigateByUrl('/users', { replaceUrl: true })
    }
  }


  public async closeUser(): Promise<void> {
    await this.userService.resetCurrentUser()
    this.router.navigateByUrl('/users', { replaceUrl: true })
  }


  

  // private async initUser() {
  //   const id = await this.storage.get(environment.loggedUsersKey) as string || ''
  //   if (id) { 
  //     const user = this.usersService.users.find(user => user.id === id)
  //     await this.userService.initUser(user)
  //   }
  // }




}
