import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from "./task-model";
import { Storage } from '@ionic/storage-angular';
import { dataRespone } from '../models/dataResponse';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment'
import { TasksOnlineService } from './tasks-online.service';

import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

export type taskFilter = 'all' | 'done' | 'todo'


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasksObs = new BehaviorSubject<Task[]>([])
  private tasksSnapshot: Task[] = []

  constructor(
    private storage: Storage,
    private userService: UserService,
    private tasksOnline: TasksOnlineService
  ) {

    if (dev) console.log('tasks service init')

    this.tasksObs.subscribe(t => {
      this.tasksSnapshot = t ? t : []
      if (dev) console.log('tasks service subscribe')
    })

    this.userService.getLoggedObs().subscribe(logged => {
      if (logged) this.loadOnlineData()
    })

  }

  private async loadOnlineData() {
    if (dev) console.log('loadOnlineData')
    const onlineTasks = await this.tasksOnline.getTasks()
    if (!onlineTasks) throw new Error('Obsluzyc get online tasks fail')
    this.resolveTasksConflicts(onlineTasks)
  }

  public async loadData() {
    if (this.KEY) {
      if (dev) console.log(`load data TASKS, key: ${this.KEY}`)
      const tasks = await this.storage.get(this.KEY) as Task[] || []
      this.tasksObs.next(tasks)
    }
  }

  public killData = () => this.tasksObs.next([])

  public async tasksSubscribtion() {
    const tasks = await this.storage.get(this.KEY) as Task[] || null
    this.tasksObs.next(tasks)
  }

  get tasks(): Task[] {
    return this.tasksSnapshot
  }
  
  public getTasks(): Observable<Task[]> {
    return this.tasksObs
      .asObservable()
      .pipe(map(tasks => this.filterTasks(tasks)))
  }


  public async addTask(task: Task): Promise<dataRespone> {
    console.log('add Task')
    console.log(task)
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }

    if (this.userService.online && this.userService.logged) {
      console.log('add task online')
      result = await this.tasksOnline.addTask(task)
      if (!result.state) return result
      task.id = result.message
    }

    const success = await this.setTasks([...this.tasksSnapshot, task] as Task[])
    if (success) {
      result.state = true
      result.message = `Dodano zadanie!`
    } else { 
      result.state = false
      result.message = `Błąd!`
    }
    return result
  }


  public async editTask(newTask: Task): Promise<dataRespone> {
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }

    if (this.userService.online && this.userService.logged) {
      result = await this.tasksOnline.editTask(newTask)
      if (!result.state) return result
    }

    const i = this.tasksSnapshot.findIndex(t => t.id === newTask.id)
    this.tasksSnapshot.splice(i, 1, newTask)

    const success = await this.setTasks(this.tasksSnapshot)
    if (success) {
      result.state = true
      result.message = `zadanie edytowano!`
    } else {
      result.state = false
      result.message = `Błąd!`
    }
    return result
  }

  public removeTask(taskId: string): void {
    const newTasks = this.tasksSnapshot.filter(task => task.id !== taskId)
    this.setTasks(newTasks)
  }

  public markAsDone(taskId: string): void {
    const task = this.tasksSnapshot.find(task => task.id === taskId)
    task.done = !task.done
    this.setTasks(this.tasksSnapshot)
  }
  
  public important(taskId: string): boolean {
    const task = this.tasksSnapshot.find(task => task.id === taskId)
    task.important = !task.important
    this.setTasks(this.tasksSnapshot)
    return task.important
  }
  
  public markSubtaskAsDone(taskId: string, subtaskIndex: number): void {
    const task = this.tasksSnapshot.find(task => task.id === taskId)
    if (task && task.subtasks[subtaskIndex]) {
      task.subtasks[subtaskIndex].done = !task.subtasks[subtaskIndex].done
      this.setTasks(this.tasksSnapshot)
    }
  }

  // REORDER

  async reorder(fromId: string, toId: string): Promise<void> {
    const fromIndex = this.tasks.findIndex(t => t.id === fromId)
    const toIndex = this.tasks.findIndex(t => t.id === toId)

    let result = copy(this.tasks)
    const taskToMove = result.splice(fromIndex, 1).pop()
    result.splice(toIndex, 0, taskToMove)
    
    await this.setTasks(result)
  }


  private task = (id: string) => this.tasks.find(task => task.id === id)


  // FILTER

  public filter: taskFilter = 'todo'

  private filterTasks(tasks: Task[]): Task[] {
    if (!tasks) return null
    let result = tasks
    switch (this.filter) { 
      case 'done': result = tasks.filter(task => task.done)
        break;
      case 'todo': result = tasks.filter(task => !task.done)
        break;
    }
    return result
  }

  setFilter(filter: taskFilter): void {
    this.filter = filter
    this.tasksObs.next(this.tasksSnapshot)
  }

  
  deleteAll() {
    this.setTasks([])
  }

  
  // STORAGE

  get uid(): string {
    return this.userService.id
  }
    
  get KEY(): string {
    if (this.userService.id) { 
      return `${environment.dataUsersKey}_${this.uid}_tasks`
    } else return ''
  }
  
  private async setTasks(tasks: Task[]): Promise<Boolean> {
    const tasksBefore = this.tasksSnapshot
    try {
      this.tasksObs.next(tasks)
      await this.storage.set(this.KEY, tasks)
      return true
    } catch (error) {
      this.tasksObs.next(tasksBefore)
      return false
    }
  }


  // EDIT FORM
  editingTaskId: string


  // CONFLICTS
  // dla usera online domyslnie zaladowywane beda taski online, 
  // jezeli ktorys z taskow ze storage bedzie mial flage modifiedOffline zostanie:
  // podmieniony lub dodany dla flagi modifiedOffline
  // usuniety dla name '$$delete$$'
  // dla kazdej operacji taska w przypadku gdy bedzie negatywna odpowiedz z serwera
  // wyskoczy alert i zapyta czy zmodyfikowac offline, wtedy dajemy flage

  private resolveTasksConflicts(onlineTasks: Task[]) {
    if (dev) console.log('resolveTasksConflicts')

    // deleted offline
    let tasksDeletedOfflineIds = this.tasksSnapshot
      .filter(t => t.name === '$$delete$$')
      .map(t => t.id)
    let result = onlineTasks.filter(t => !tasksDeletedOfflineIds.find(id => id === t.id))

    let tasksModifiedOffline = this.tasksSnapshot.filter(t => t.modifiedOffline === true)
    tasksModifiedOffline.forEach(t => {
      const taskExistsIndex = result.findIndex(tr => t.id === tr.id)
      if (taskExistsIndex !== -1) {
        result[taskExistsIndex] = t
      } else result.push(t)
    })

    // console.log(this.tasksSnapshot)
    // console.log(onlineTasks)
    console.log(result)

    console.log('TODO: do przetestowania ta metoda')
    this.tasksObs.next(result)
  }

}

const copy = (item: any) => JSON.parse(JSON.stringify(item))