import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonAccordionGroup, ToastController } from '@ionic/angular';
import { Task, Subtask } from 'src/app/tasks/task-model';
import { TasksService } from 'src/app/tasks/tasks.service';
import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() task: Task
  @Input() index: number

  @ViewChild('accordionRef') accordionRef: IonAccordionGroup
  
  constructor(
    private tasksService: TasksService,
    public toastController: ToastController,
    public router: Router,
  ) { }
  
  subtasks: Subtask[] = []
  
  // css class flags
  taskNameLimit: number = 40
  taskImportant: boolean


  ngOnInit() {
    if (this.task.subtasks && this.task.subtasks.length) { 
      this.subtasks = this.task.subtasks 
    }
    this.taskImportant = this.task.important
  }
  
  ngAfterViewInit() {
    if (this.task.open) {
      this.accordionRef.value = `${this.index}`
    }
  }

  ngOnDestroy() {
  }


  accordion() {
    if (this.accordionRef.value === `${this.index}`) {
      this.show()
    } else { 
      this.close()
    }
  }

  markAsDone() {
    this.tasksService.markAsDone(this.task.id)
    if (this.tasksService.filter !== 'all') { 
      this.markAsDoneToast(this.task.id)
    }
  }

  removeTask() {
    this.removeTaskAlert()
  }

  edit() {
    this.tasksService.editingTaskId = this.task.id
    this.router.navigateByUrl('/edit-task', { replaceUrl: true })
  }

  async important() { 
    this.taskImportant = await this.tasksService.important(this.task.id)
  }

  
  markSubtaskAsDone(subtaskIndex: number) {
    this.tasksService.markSubtaskAsDone(this.task.id, subtaskIndex);
  }


  // INTERFACES

  private async removeTaskAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Uwaga';
    alert.subHeader = this.limitToPipe(this.task.name, 15);
    alert.message = 'Czy na pewno chcesz usunąć?';
    alert.cssClass = 'my-alert-wrapper';
    alert.buttons = [{
      text: 'Nie',
      role: 'cancel',
    },{
      text: 'Tak',
      role: 'confirm',
      handler: () => this.tasksService.removeTask(this.task.id)
    }];
    document.body.appendChild(alert);
    await alert.present();
  }

  async markAsDoneToast(taskId: string) {
    const toast = await this.toastController.create({
      header: `Zadanie przeniesiono do ${this.tasksService.filter === 'done'? 'nieukończonych':'skończonych'}`,
      position: 'bottom',
      duration: 3000,
      buttons: [
        {
          text: 'COFNIJ',
          handler: () => this.tasksService.markAsDone(taskId)
        }
      ]
    });
    await toast.present();
  }



  // OTHERS

  private show() {
    this.task.open = true
    this.accordionRef.value === `${this.index}`
    let increment = setInterval(() => { 
      this.taskNameLimit++
      if (this.taskNameLimit > this.task.name.length) { 
        clearInterval(increment)
      }
    }, 7)
  } 

  private close() {
    this.task.open = false
    this.accordionRef.value === ``
    let decrement = setInterval(() => { 
      this.taskNameLimit--
      if (this.taskNameLimit <= 40) { 
        clearInterval(decrement)
      }
    }, 7)
  }

  private limitToPipe(value: string, args: number) {
    let limit = args ? args : 10;
    let trail = '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }







  // CLICKING

  timestamp: number
  collapsed: boolean = true

  
  // EVENTS

  onStart(timestamp: number): void { 
    this.timestamp = timestamp
  }
  
  onEnd(timestamp: number): void {
    if (timestamp - this.timestamp < 200) this.click()
    this.timestamp = 0
  }

  click(): void {
    console.log('click')
    this.collapsed = !this.collapsed
  }


}
