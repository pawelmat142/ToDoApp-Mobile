import { HttpClient } from '@angular/common/http'
import { Component, ElementRef, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { dataRespone } from 'src/app/models/dataResponse'
import { UsersService } from 'src/app/users/users.service'
import { CustomValidators } from '../../providers/validators'
import { environment } from '../../../environments/environment'
import { IdService } from 'src/app/services/id.service'


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage {

  constructor(
    private usersService: UsersService,
    public router: Router,
    private http: HttpClient,
    private id: IdService
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
    this.submitted = true

    const userExist = this.usersService.users.find(u => u.nickname === this.f.nickname.value)
    if (userExist) {
      this.setMessage({state: false, message: 'Użytkownik o takim nicku już istnieje'})
      return
    }

    let userId: string
    if (this.f.online.value) {
      userId = await this.addUserToDb()
      if (!userId) return
    } else {
      userId = this.id.generate()
    }

    const success = await this.usersService.addNewUser({
      id: userId,
      nickname: this.f.nickname.value,
      password: this.f.password.value,
      logged: false,
      online: this.f.online.value,
    })

    if (success) {
      this.setMessage({state: true, message: 'Dodano użytkownika ' + this.f.nickname.value})
      setTimeout(() => this.router.navigateByUrl('/users', { replaceUrl: true }), 2000)
    } else {
      this.setMessage({state: false, message: 'Błąd dodawania do pamięci!'})
    }
  }


  // ONLINE STAFF

  private url = environment.apiUrl

  private addUserToDb = () => new Promise<string>((resolve) => {
    const body = {
      nickname: this.f.nickname.value,
      password: this.f.password.value,
      confirmPassword: this.f.password.value
    }
    this.http.post<never>(this.url + '/register', body, {observe: 'response'}).subscribe(
      (res) => {
        const userId = res.headers.get('X-Custom-Header')
        resolve(userId)
      },
      (error) => {
        this.setMessage({state: false, message: error.error.message})
        resolve('')
      }
    )
  })


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
