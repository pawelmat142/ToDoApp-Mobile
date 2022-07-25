import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { nUser, User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

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
    private http: HttpService,
    public router: Router,
    private userService: UserService
  ) { 
    // this.currentUser = userService.user
    console.log(this.currentUser)
  }
  

  submitted = false;

  message = ''
  messageErr = false

  get f() { return this.loginForm.controls }


  key(evnet: Event) { 
    console.log(event)
  }

  onSubmit(): void {
    this.submitted = true
    if (this.loginForm.invalid) return
    this.http.login(this.loginForm.value as Partial<User>)
      .subscribe(
        () => this.succes(),
        error => this.failure(error)
    )
  }

  private succes(): void {
    console.log('succes')
    this.submitted = false
    this.loginForm.reset()
    this.message = 'Zalogowano'
    setTimeout(() => this.router.navigateByUrl('/tasks', { replaceUrl: true }), 1000)
  }
  
  private failure(error: HttpErrorResponse): void {
    console.log('fail')
    this.message = error.error.message
    // this.message = 'Błąd logowania!'
    this.messageErr = true
    this.loginForm.reset()
    this.submitted = false
    setTimeout(() => { 
      this.message = ''
      this.messageErr = false
    }, 5000)
  }

}
