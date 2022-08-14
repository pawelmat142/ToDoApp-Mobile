import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { dataRespone } from 'src/app/models/dataResponse';
import { Credentials, nUser, User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';

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
    console.log(this.currentUser)
  }
  
  @ViewChild('submit', {read: ElementRef}) submitRef: ElementRef

  submitted = false;

  message = ''
  messageErr = false

  get f() { return this.loginForm.controls }


  key(evnet: Event) { 
    console.log(event)
  }

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

    console.log('online case')

    const result: dataRespone = await this.usersService.login(credentials)

    this.message = result.message
    this.messageErr = !result.state

    if (result.state) {
      this.submitRef.nativeElement.setAttribute('disabled', 'true')
      setTimeout(() => this.router.navigateByUrl('/tasks', { replaceUrl: true }), 2000)
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
