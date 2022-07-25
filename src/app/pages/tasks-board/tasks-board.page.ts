import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Task } from 'src/app/models/task';
import { taskFilter, TasksService } from 'src/app/services/tasks.service';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-tasks-board',
  templateUrl: './tasks-board.page.html',
  styleUrls: ['./tasks-board.page.scss'],
})
export class TasksBoardPage implements OnInit, OnDestroy {

  tasks: Task[]

  private subscription: Subscription

  constructor(
    private tasksService: TasksService,
    private userService: UserService
  ) { }
  
  get filter(): taskFilter { 
    return this.tasksService.filter
  }

  set filter(filter: taskFilter) {
    this.tasksService.setFilter(filter)
  }


  ngOnInit() {
    this.tasksSubscribtion()
  }

  ngOnDestroy() {
    this.tasksUnsubscribe()
  }
  
  
  private tasksSubscribtion() { 
    this.tasksUnsubscribe()
    this.subscription = this.tasksService
    .getTasks()
    .subscribe(data => {
      console.log('tasks subscribe')
      this.tasks = data ? data : []
    })
  }

  private tasksUnsubscribe() {
    if (this.subscription && !this.subscription.closed) { 
      this.subscription.unsubscribe()
    }
  }




  doReorder(event: CustomEvent<ItemReorderEventDetail>) { 
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    console.log(event)

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete()
  }

  logout() {
    this.userService.logout()
  }

}
