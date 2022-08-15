import { Component, OnDestroy, OnInit } from '@angular/core';
import { nUser } from 'src/app/models/user';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';

import { isDevMode } from '@angular/core'
import { dataRespone } from 'src/app/models/dataResponse';
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {

  users: nUser[] = []

  constructor(
    public router: Router,
    private usersService: UsersService,
    private userService: UserService,
  ) {
    if (dev) console.log('usersPage constructor')
    this.usersSubscribtion = this.usersService.getUsersObs().subscribe((users: nUser[]) => {
      this.users = users
    })
  }

  message: string
  messageErr: boolean = false

  usersSubscribtion: any

  ngOnInit() {
    this.userService
    this.usersSubscribtion = this.usersService.getUsersObs().subscribe((users: nUser[]) => {
      this.users = users
    })
  }

  ngOnDestroy() {
    this.usersSubscribtion.unsubscribe()
  }


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
