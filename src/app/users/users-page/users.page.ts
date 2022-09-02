import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from 'src/app/users/user.service'
import { UsersService } from 'src/app/users/users.service'
import { dataRespone } from 'src/app/models/dataResponse'
import { Subscription } from 'rxjs'
import { nUser } from '../user'

import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage {

  users: nUser[] = []

  private usersSubscribtion: Subscription

  constructor(
    public router: Router,
    private usersService: UsersService,
    private userService: UserService,
  ) {
    if (dev) console.log('usersPage constructor')
    if (!this.usersSubscribtion) {
      console.log('users page subscribtion')
      this.usersSubscribtion = this.usersService.getUsersObs().subscribe((users: nUser[]) => {
        this.users = users
      })
    }
  }

  ionViewWillEnter() {
    this.usersSubscribtion = this.usersService.getUsersObs().subscribe(u => {
      this.users = u
    })
  }

  ionViewWillLeave() {
    this.usersSubscribtion.unsubscribe()
  }

  message: string
  messageErr: boolean = false

  
  async chooseUser(user: nUser): Promise<void> {
    let result = await this.userService.chooseUser(user.id)
    this.setMessage(result)
    if (result.state) {
      this.router.navigateByUrl('/tasks', { replaceUrl: true })
    }
  }


  private setMessage(result: dataRespone): void {
    this.message = result.message
    this.messageErr = !result.state
    setTimeout(() => {
      this.message = ''
      this.messageErr = false
    }, 5000)
  }

}
