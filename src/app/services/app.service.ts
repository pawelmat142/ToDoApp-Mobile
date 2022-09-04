import { isDevMode } from '@angular/core'
const dev = isDevMode()

import { Injectable } from '@angular/core'
import * as Cordovasqlitedriver from 'localforage-cordovasqlitedriver'
import { Storage } from '@ionic/storage-angular'
import { Router } from '@angular/router'
import { UserService } from '../users/user.service'
import { UsersService } from '../users/users.service'

import { App } from '@capacitor/app'

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    public router: Router,
    public storage: Storage,
    private usersService: UsersService,
    private userService: UserService,
  ) {
    if (dev) console.log('appService constructor')
    this.init()
  }

  private async init() {
    await this.initStorage()
    await this.initUsers()
    await this.initUser()
    await this.redirect()
  }

  private async initStorage() {
    await this.storage.defineDriver(Cordovasqlitedriver) 
    await this.storage.create()
    if (dev) console.log('storage initialized')
  }

  private async initUsers() {
    await this.usersService.initUsers()
    if (dev) console.log('users initialized')
  }

  private async initUser() {
    await this.userService.initUser()
    if (dev) console.log('user initialized')
  }

  private async redirect() {
    if (this.userService.user) {
      if (dev) console.log(`user ${this.userService.user.nickname} loaded, redirect to tasks board`)
      this.router.navigateByUrl('/tasks', { replaceUrl: true })
    } 
  }


}
