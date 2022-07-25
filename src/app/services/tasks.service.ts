import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from "../models/task";
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http'
import { Storage } from '@ionic/storage-angular';
import { dataRespone } from '../models/dataResponse';
import { UserService } from './user.service';
import { environment } from '../../environments/environment'

export type taskFilter = 'all' | 'done' | 'todo'


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasksObs = new BehaviorSubject<Task[]>([])
  private tasksSnapshot: Task[] = []

  constructor(
    private storage: Storage,
    private userService: UserService
  ) {
    this.init()
    console.log('tasks service init')
  }

  private async init() {
    const tasks = await this.storage.get(this.KEY) as Task[] || null
    this.tasksObs.next(tasks)
    this.tasksObs.subscribe(t => {
      this.tasksSnapshot = t ? t : []
    })
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
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    const success = await this.setTasks([...this.tasksSnapshot, task] as Task[])
    if (success) {
      result.state = true
      result.message = `Dodano zadanie!`
    } else { 
      result.message = `Błąd!`
    }
    return result
  }

  public async editTask(newTask: Task): Promise<dataRespone> {
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    const i = this.tasksSnapshot.findIndex(t => t.id === newTask.id)
    this.tasksSnapshot.splice(i, 1, newTask)
    const success = await this.setTasks(this.tasksSnapshot)
    if (success) {
      result.state = true
      result.message = `Dodano zadanie!`
    } else { 
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


  // FILTER

  public filter: taskFilter = 'todo'

  private filterTasks(tasks: Task[]): Task[] {
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
}