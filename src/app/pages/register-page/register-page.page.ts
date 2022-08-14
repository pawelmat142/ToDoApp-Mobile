import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dataRespone } from 'src/app/models/dataResponse';
import { nUser } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { CustomValidators } from '../../providers/validators';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage {

  constructor(
    private usersService: UsersService,
    public router: Router
  ) { }

  registerForm = new FormGroup(
    {
      nickname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]),
      confirmPassword: new FormControl('', [Validators.required]),
      online: new FormControl(false),
    },
    CustomValidators.mustMatch('password', 'confirmPassword')
  )

  @ViewChild('submit', {read: ElementRef}) submitRef: ElementRef

  submitted = false;

  message = ''
  messageErr = false

  get f() { return this.registerForm.controls }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return
    const newUser: nUser = {
      id: this.f.online ? '' : this.f.nickname.value,
      nickname: this.f.nickname.value,
      password: this.f.password.value,
      logged: false,
      online: this.f.online.value,
    }

    const result: dataRespone = await this.usersService.addUser(newUser)
    this.message = result.message
    this.messageErr = !result.state
    
    if (result.state) {
      this.submitRef.nativeElement.setAttribute('disabled', 'true')
      setTimeout(() => this.router.navigateByUrl('/users', { replaceUrl: true }), 2000)
    } else { 
      setTimeout(() => this.message = '', 5000)
    }


    this.submitted = true
  }

}
