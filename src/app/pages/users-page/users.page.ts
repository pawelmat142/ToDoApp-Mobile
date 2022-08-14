import { Component, OnDestroy, OnInit } from '@angular/core';
import { nUser } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from '../../../environments/environment'
import { UsersService } from 'src/app/services/users.service';


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
    private userService: UserService
  ) {}

  message: string
  messageErr: boolean = false

  usersSubscribtion: any

  ngOnInit() {
    this.userService
    this.usersSubscribtion = this.usersService.get().subscribe((users: nUser[]) => {
      this.users = users
    })
  }

  ngOnDestroy() {
    this.usersSubscribtion.unsubscribe()
  }


  chooseUser(user: nUser): void {
    if (user.online) {
      this.message = 'online nieobslużone!'
      this.messageErr = true
      this.message = ''
    } else {
      console.log(user.id)
      this.userService.login(user.id)
    }
  }

}
