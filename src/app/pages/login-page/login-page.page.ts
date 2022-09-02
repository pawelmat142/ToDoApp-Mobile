import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { dataRespone } from 'src/app/models/dataResponse'
import { Credentials, nUser } from 'src/app/models/user'
import { UserService } from 'src/app/users/user.service'
import { UsersService } from 'src/app/users/users.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import jwt_decode from 'jwt-decode'


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
    private userService: UserService,
    private http: HttpClient,
  ) { }
  
  @ViewChild('submit', {read: ElementRef}) submitRef: ElementRef

  submitted = false;

  message = ''
  messageErr = false

  get f() { return this.loginForm.controls }

  private url = environment.apiUrl

  async onSubmit(): Promise<void> {
    this.submitted = true
    if (this.loginForm.invalid) return

    const credentials: Credentials = {
      nickname: this.loginForm.value.nickname,
      password: this.loginForm.value.password
    }

    const userExist = this.usersService.users.find(u => u.nickname === credentials.nickname)

    if (userExist) {
      if (dev) console.log('user exist')
      let result = await this.userService.chooseUser(userExist.id)
      this.setMessage(result)
      if (result.state) this.router.navigateByUrl('/tasks', { replaceUrl: true })
      return
    } 
    else {
      this.http.post<any>(this.url + '/login', {
        nickname: credentials.nickname,
        password: credentials.password
      }).subscribe(
        (token) => this.success(token),
        (error) => {
          if (dev) console.log(error)
          this.setMessage({state: false, message: 'Błedne dane logowania!'})
        }
      )
    }
  }

  private async success(token: string) {
    this.submitRef.nativeElement.setAttribute('disabled', 'true')
    
    const newUser: nUser = {
      id: jwt_decode(token)['id'],
      nickname: this.f.nickname.value,
      password: this.f.password.value,
      logged: false,
      online: true,
      token: token
    }

    let result = await this.usersService.addOnlineExistingUser(newUser)
    if (result.state) {
      result = await this.userService.chooseUser(newUser.id)
    }
    if (result.state) {
      this.router.navigateByUrl('/tasks', { replaceUrl: true })
    }
    this.setMessage(result)
  }


  // OTHERS

  private setMessage(result: dataRespone): void {
    if (result.state) {
      this.submitRef.nativeElement.setAttribute('disabled', 'true')
    }
    this.message = result.message
    this.messageErr = !result.state
    setTimeout(() => {
      this.message = ''
      this.messageErr = false
    }, 5000)
  }


}
