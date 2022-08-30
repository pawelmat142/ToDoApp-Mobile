import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { taskFilter, TasksService } from 'src/app/tasks/tasks.service';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';
import { NotesService } from 'src/app/notes/notes.service';


import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private userService: UserService,
    private tasksService: TasksService,
    private notesService: NotesService,
    public router: Router,
    private usersService: UsersService,
  ) { }

  ngOnInit() { }


  // account

  async closeUser() {
    this.usersService.removeUserToken(this.userService.id)
    await this.userService.resetCurrentUser()
    this.tasksService.clearObservable()
    this.notesService.clearObservable()
    if (dev) console.log('user closing!')
    this.router.navigateByUrl('/users', { replaceUrl: true })
  }

  async deleteAccount() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Uwaga!';
    alert.subHeader = this.userService.user.nickname;
    alert.message = 'Czy na pewno chcesz usunąć konto?';
    alert.cssClass = 'my-alert-wrapper';
    alert.buttons = [{
        text: 'Nie',
        role: 'cancel',
      },
    {
      text: 'Tak',
      role: 'confirm',
      handler: async () => {
        this.userService.resetCurrentUser()
        console.log('TODO: deleting user online')
        const success = await this.usersService.deleteUserInStorage(this.userService.id)
        if (success) {
          this.router.navigateByUrl('/users', { replaceUrl: true })
        }
      }
    }];
    document.body.appendChild(alert);
    await alert.present();
  }


  setTasksFilter(filter: taskFilter) {
    this.tasksService.setFilter(filter)
    this.router.navigateByUrl('/tasks', { replaceUrl: true })
  }
  
  async deleteAllTasks() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Uwaga!';
    alert.subHeader = 'Bezpowrotnie usuniesz wszystkie zadania';
    alert.message = 'Czy na pewno chcesz je usunąć?';
    alert.cssClass = 'my-alert-wrapper';
    alert.buttons = [{
        text: 'Nie',
        role: 'cancel',
      },
    {
      text: 'Tak',
      role: 'confirm',
      handler: () => {
        this.tasksService.deleteAll()
        this.router.navigateByUrl('/tasks', { replaceUrl: true })
      }
    }];
    document.body.appendChild(alert);
    await alert.present();
  }

}
