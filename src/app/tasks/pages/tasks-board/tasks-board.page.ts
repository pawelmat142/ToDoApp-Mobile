import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonReorderGroup, ItemReorderEventDetail, ToastController } from '@ionic/angular';
import { Task } from 'src/app/tasks/task-model';
import { taskFilter, TasksService } from 'src/app/tasks/tasks.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.page.html',
  styleUrls: ['./tasks-board.page.scss'],
})
export class TasksBoardPage {

  constructor(
    private tasksService: TasksService,
    public toastController: ToastController,
  ) { 
    this.subscribeTasks()
  }

  tasks: Task[]

  private subscribeTasks = () => this.tasksService
    .getTasks().subscribe($tasks => this.tasks = $tasks)

  ionViewWillEnter = async () => await this.tasksService.loadData()
  // ionViewWillLeave = () => this.tasksService.killData()


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
    let msg = ''
    if (this.reorderGroup.disabled) {
      msg = 'Sortowanie zadań zostało wyłączone!'
    } else msg = 'Sortowanie zadań zostało włączone!'

    const toast = await this.toastController.create({
      header: 'Sortowanie '+(this.reorderGroup.disabled?'wyłączone!':'włączone!'),
      position: 'middle',
      duration: 500,
      cssClass: 'my-toast'
    });
    await toast.present();
  }


  doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    const from = event.detail.from
    const to = event.detail.to
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
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
