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

  constructor(
    public router: Router,
    public storage: Storage,
    private userService: UserService,
    private usersService: UsersService
  ) {
    this.init()
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
    const users = await this.storage.get(environment.dataUsersKey) as nUser[] || null
    await this.usersService.initUsers(users)
  }


  private async initUser() {
    const id = await this.storage.get(environment.loggedUsersKey) as string || ''
    if (id) { 
      const user = this.usersService.users.find(user => user.id === id)
      await this.userService.initUser(user)
    }
  }


  private async redirect() {
    const user = this.userService.user
    if (user) {
      if (dev) console.log(`user ${user.nickname} logged, redirect to tasks board`)
      this.router.navigateByUrl('/tasks', { replaceUrl: true })
      // this.router.navigateByUrl('/notes', { replaceUrl: true })
    } else { 
      if (dev) console.log(`no user logged, redirect to users page`)
      // this.router.navigateByUrl('/users', { replaceUrl: true })
      this.router.navigateByUrl('/login', { replaceUrl: true })
    }
  }

}
