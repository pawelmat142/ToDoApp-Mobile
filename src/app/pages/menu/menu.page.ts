import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { taskFilter, TasksService } from 'src/app/services/tasks.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(
    private userService: UserService,
    private tasksService: TasksService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  // account

  logout() { 
    this.userService.logout()
  }

  deleteAccount() { 
    console.log('delete')
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
