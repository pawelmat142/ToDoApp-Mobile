import { Component, ViewChild } from '@angular/core'
import { IonReorderGroup, ItemReorderEventDetail, ToastController } from '@ionic/angular'
import { Task } from 'src/app/tasks/task-model'
import { taskFilter, TasksService } from 'src/app/tasks/tasks.service'
import { Subscription } from 'rxjs'

import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.page.html',
  styleUrls: ['./tasks-board.page.scss'],
})
export class TasksBoardPage {

  tasks: Task[]
  private tasksSubscribtion: Subscription

  constructor(
    private tasksService: TasksService,
    public toastController: ToastController,
  ) {
    if (dev) console.log('tasksComponent constructor')
  }

  async ionViewWillEnter() {
    await this.tasksService.loadTasks()
    this.tasksSubscribtion = this.tasksService.getTasksObs()
      .subscribe(t => {
        this.tasks = t.filter(t => t.name !== '$$delete$$')
      })
  }
  
  async ionViewWillLeave() {
    this.tasksSubscribtion.unsubscribe()
  }



  // REORDER

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  reorder = false

  reorderOn() {
    if (this.reorderGroup!.disabled) { 
      this.reorderGroup.disabled = false
      this.reorder = true
      this.reorderToast()
    }
  }

  reorderOff() {
    if (!this.reorderGroup!.disabled) { 
      this.reorderGroup.disabled = true
      this.reorder = false
      this.reorderToast()
    }
  }

  async reorderToast() {
    const toast = await this.toastController.create({
      header: 'Sortowanie '+(this.reorderGroup.disabled?'wyłączone!':'włączone!'),
      position: 'middle',
      duration: 500,
      cssClass: 'my-toast'
    })
    await toast.present();
  }


  doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    const from = event.detail.from
    const to = event.detail.to
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to)
    this.tasksService.reorder(this.tasks[from].id, this.tasks[to].id)
    // dokonczyc animacje wracania
    event.detail.complete()
  }

  
  
  // OTHERS
  
  private task = (id: string) => this.tasks.find(task => task.id === id)
  
  emiter() {
    console.log('emiter')
  }


  // FILTER

  get filter(): taskFilter { 
    return this.tasksService.filter
  }

  set filter(filter: taskFilter) {
    this.tasksService.setFilter(filter)
  }

  changeFilter(): void {
    if (this.filter === 'all') {
      this.tasksService.setFilter('done')
    } 
    else if (this.filter === 'done') {
      this.tasksService.setFilter('todo')
    }
    else if (this.filter === 'todo') {
      this.tasksService.setFilter('all')
    }
  }
  
}


const copy = (item: any) => JSON.parse(JSON.stringify(item))
