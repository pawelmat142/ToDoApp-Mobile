import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataRespone } from '../models/dataResponse';
import { UsersOnlineService } from '../services/users-online.service';
import { Subtask, Task, TaskOnline } from './task-model';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'

import { isDevMode } from '@angular/core';
import { UserService } from '../services/user.service';
const dev = isDevMode() ? true : false

@Injectable({
  providedIn: 'root'
})
export class TasksOnlineService {

  private url = environment.apiUrl
  
  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
  }

  private get headers(): HttpHeaders {
    return this.userService.getHeaders()
  }


  getTasks = () => new Promise<Task[]>(resolve => {
    this.http.get<TaskOnline[]>(this.url + '/tasks', {
      headers: this.headers
    }).subscribe(
      (tasks: TaskOnline[]) => {
        resolve(tasks.map(t => this.taskOnlineToTask(t)))
      },
      (error) => resolve(null)
    )
  })
    

  addTask = (_task: Task) => new Promise<string>((resolve) => {
    if (dev) console.log('add task online')
    let task: TaskOnline = this.taskToTaskOnline(_task)

    this.http.post<any>(this.url + '/task', task, { 
      headers: this.headers,
      observe: 'response'
    }).subscribe(
      (res) => {
        const newTaskId = res.headers.get('X-Custom-Header')
        resolve(newTaskId)
      },
      (error) => resolve('')
    )
  })


  editTask = (newTask: Task) => new Promise<boolean>((resolve) => {
    let task: TaskOnline = this.taskToTaskOnline(newTask)

    console.log(newTask)

    const params = new HttpParams().set('_id', task.id)
    this.http.put<void>(this.url + '/task', task, {
      params: params,
      headers: this.headers
    }).subscribe(
      (data) => resolve(true),
      (error) => resolve(false)
    )
  })


  removeTask = (taskId: string) => new Promise<boolean>(resolve => {
    const params = new HttpParams().set('_id', taskId)
    this.http.delete<void>(this.url + '/delete', {
      params: params,
      headers: this.headers
    }).subscribe(
      () => resolve(true),
      error => resolve(false)
    )
  })
  
  markAsDone = (taskId: string, done: boolean) => new Promise<boolean>(resolve => {
    const params = new HttpParams().set('_id', taskId)
    const body = {done: done}

    this.http.patch<void>(this.url + '/done', body, {
      params: params,
      headers: this.headers
    }).subscribe(
      () => resolve(true),
      error => resolve(false)
    )
  })
    
  markAsImportant = (taskId: string, important: boolean) => new Promise<boolean>(resolve => {
    const params = new HttpParams().set('_id', taskId)
    const body = {important: important}

    this.http.patch<void>(this.url + '/important', body, {
      params: params,
      headers: this.headers
    }).subscribe(
      () => resolve(true),
      error => resolve(false)
    )
  })

  updateSubtasks = (taskId: string, subtasks: Subtask[]) => new Promise<boolean>(resolve => {
    const params = new HttpParams().set('_id', taskId)
    const body = {subtasks: JSON.stringify(subtasks)}
    
    this.http.patch<void>(this.url + '/subtasks', body, {
      params: params,
      headers: this.headers
    }).subscribe(
      () => resolve(true),
      error => resolve(false)
    )
  })
  
  reorder = (tasks: Task[]) => new Promise<boolean>(resolve => {

    const tasksOnline = tasks.map(task => this.taskToTaskOnline(task))
    const body = { tasks: tasksOnline }

    this.http.post<void>(this.url + '/reorder', body, {
      headers: this.headers
    }).subscribe(
      () => resolve(true),
      error => resolve(false)
      
    )
  })


  deleteAll = () => new Promise<boolean>(resolve => {
    this.http.delete<void>(this.url + '/del', {
      headers: this.headers
    }).subscribe(
      () => resolve(true),
      error => resolve(false)
    )
  })


  deleteAllDone = () => new Promise<boolean>(resolve => {
    this.http.delete<void>(this.url + '/deldone', {
      headers: this.headers
    }).subscribe(
      () => resolve(true),
      error => resolve(false)
    )
  })








  // OTHERS

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) return 'Brak tokena'
    if (error.status === 403) return 'Zły token!'
    else return 'Nieznany bład'
  }


  private taskToTaskOnline(task: Task): TaskOnline {
    let result: TaskOnline = {
      name: task.name,
      done: task.done,
      important: task.important,
    }
    if (task.deadline) {
      result.deadline = task.deadline
    }
    if (task.subtasks && task.subtasks.length) {
      result.subtasks = JSON.stringify(task.subtasks)
    }
    if (task.id) {
      result.id = task.id
    }
    if (task.user_id) {
      result.userId = task.user_id
    }
    return result
  }

  private taskOnlineToTask(taskOnline: TaskOnline): Task {
    let result: Task = {
      id: taskOnline.id,
      user_id: taskOnline.userId,
      name: taskOnline.name,
      important: taskOnline.important,
      done: taskOnline.done,
      open: false,
    }
    if (taskOnline?.deadline) {
      result.deadline = taskOnline.deadline
    }
    if (taskOnline?.subtasks && taskOnline.subtasks.length) {
      result.subtasks = JSON.parse(taskOnline.subtasks) as Subtask[]
    }
    return result
  }

}
