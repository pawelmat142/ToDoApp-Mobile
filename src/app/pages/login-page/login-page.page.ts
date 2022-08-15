import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dataRespone } from 'src/app/models/dataResponse';
import { Credentials, nUser } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';
import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage {

  @Output() loginEvent = new EventEmitter<void>()
  @Output() toRegisterForm = new EventEmitter<void>()

  currentUser: nUser

  loginForm = new FormGroup(
    {
      nickname: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
    },
  )

  constructor(
    public router: Router,
    private usersService: UsersService,
    private userService: UserService
  ) {
    if (dev) console.log(`${this.currentUser} logged now`)
  }
  
  @ViewChild('submit', {read: ElementRef}) submitRef: ElementRef

  submitted = false;

  message = ''
  messageErr = false

  get f() { return this.loginForm.controls }


  async onSubmit(): Promise<void> {
    this.submitted = true
    if (this.loginForm.invalid) return

    const credentials: Credentials = {
      nickname: this.loginForm.value.nickname,
      password: this.loginForm.value.password
    }

    const user = this.usersService.users.find(u => u.nickname === credentials.nickname)

    if (user && user.online === false) {
      this.offlineCase(user, credentials)
      return
    } 

    if (dev) console.log('online case')

    const result: dataRespone = await this.usersService.login(credentials)
    const userId = result.message
    console.log('userId: ' + userId)

    this.message = 'Zalogowano!'
    this.messageErr = !result.state

    if (result.state) {
      this.submitRef.nativeElement.setAttribute('disabled', 'true')
      this.userService.setUser(userId)
    } else { 
      setTimeout(() => this.message = '', 5000)
    }
  }

  private async offlineCase(user: nUser, credentials: Credentials) {
    if (credentials.password === user.password) {
      const result = await this.userService.setUser(user.id)
    } else {
      this.message = 'Błędne hasło'
      this.messageErr = true
      setTimeout(() => {
        this.message = ''
        this.messageErr = false
      },5000)
    }
  }

}
