import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonAccordionGroup, ToastController } from '@ionic/angular';
import { Subtask } from 'src/app/models/subtask';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';

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
  accordionExpanded: boolean = false
  taskNameLimit: number = 40
  taskImportant: boolean


  ngOnInit() {
    if (this.task.subtasks && this.task.subtasks.length) { 
      this.subtasks = this.task.subtasks 
    }
    this.taskImportant = this.task.important
  }
  
  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }



  accordion() {
    if (this.accordionRef.value === `${this.index}`) {
      this.accordionRef.value = ''
      this.accordionExpanded = false
      this.close()
    } else { 
      this.accordionRef.value = `${this.index}`
      this.accordionExpanded = true
      this.show()
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

  important() { 
    this.taskImportant = this.tasksService.important(this.task.id)
  }


  private async removeTaskAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Uwaga';
    alert.subHeader = this.task.name;
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

  markSubtaskAsDone(subtaskIndex: number) {
    this.tasksService.markSubtaskAsDone(this.task.id, subtaskIndex);
  }


  // INTERFACES

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
    let increment = setInterval(() => { 
      this.taskNameLimit++
      if (this.taskNameLimit > this.task.name.length) { 
        clearInterval(increment)
      }
    }, 7)
    
  } 

  private close() {
    let decrement = setInterval(() => { 
      this.taskNameLimit--
      if (this.taskNameLimit <= 40) { 
        clearInterval(decrement)
      }
    }, 7)

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
