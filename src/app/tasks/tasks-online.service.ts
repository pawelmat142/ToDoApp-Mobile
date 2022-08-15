import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataRespone } from '../models/dataResponse';
import { UsersOnlineService } from '../services/users-online.service';
import { Subtask, Task, TaskOnline } from './task-model';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'

import { isDevMode } from '@angular/core';
const dev = isDevMode() ? true : false

@Injectable({
  providedIn: 'root'
})
export class TasksOnlineService {

  private headers = new HttpHeaders({ 'Authorization': '' })

  private url = environment.apiUrl
  
  constructor(
    private http: HttpClient,
    private usersOnline: UsersOnlineService
  ) {
    this.headers = new HttpHeaders({ 'Authorization': '' })
    
    this.usersOnline.getTokenObs().subscribe(token => {
    if (dev) console.log(`setting token in tasksOnSer: ${token}`)
    if (token) {
        // this.headers = this.headers.set('Authorization', 'Bearer ' + 'xxx')
        this.headers = this.headers.set('Authorization', 'Bearer ' + token)
      } else {
        this.headers = this.headers.set('Authorization', '')
      }
    })
  }


  getTasks = () => new Promise<Task[]>(resolve => {
    this.http.get<TaskOnline[]>(this.url + '/tasks', {headers: this.headers}).subscribe(
      (tasks: TaskOnline[]) => {
        resolve(tasks.map(t => this.taskOnlineToTask(t)))
      },
      (error) => {
        resolve(null)
      }
    )
  })
    

  addTask = (_task: Task) => new Promise<dataRespone>((resolve) => {
    if (dev) console.log('add task online')
    let dataRespone: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }

    let task: TaskOnline = this.getTaskOnline(_task)

    this.http.post<any>(this.url + '/task', task, { 
      headers: this.headers,
      observe: 'response'
    }).subscribe(
        (res) => {
          dataRespone.state = true
          dataRespone.message = res.headers.get('X-Custom-Header')  //id
          resolve(dataRespone)
        },
        (error) => {
          dataRespone.message = this.getErrorMessage(error)
          resolve(dataRespone)
        }
      )
  })


  editTask = (newTask: Task) => new Promise<dataRespone>((resolve) => {
    let dataRespone: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }

    console.log(newTask)

    let task: TaskOnline = this.getTaskOnline(newTask)

    console.log(task)

    console.log(this.headers)

    const params = new HttpParams().set('_id', task.id)
    this.http.put<void>(this.url + '/task', task, {
      params: params,
      headers: this.headers
    }).subscribe(
      (data) => {
        console.log(data)
      },
      (error) => {
        console.log(error)
      }
    )

    return dataRespone

  })  



  // OTHERS

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) return 'Brak tokena'
    if (error.status === 403) return 'Zły token!'
    else return 'Nieznany bład'
  }


  private getTaskOnline(task: Task): TaskOnline {
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
