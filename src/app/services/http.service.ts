import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,  } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegisterForm } from '../models/registerForm';
import { User } from '../models/user';
import { Task } from '../models/task';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // private url = 'http://localhost:3333'

  private url = 'https://todo.drawit.click/api'
  
  private headers = new HttpHeaders({ 'Authorization': '' })
  
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token')
    if (token) this.setTokenHeader(token)
  }
  
  
  register(body: RegisterForm): Observable<never> {
    return this.http.post<never>(this.url + '/register', body)
  }


  login(body: Partial<User>): Observable<string> {
    return this.http.post<string>(this.url + '/login', body)
      .pipe(tap(token => { 
        this.setTokenHeader(token)
        localStorage.setItem('token', token)
      }))
  }

    
  tasks(): Observable<Task[]> { 
    return this.http.get<Task[]>(this.url + '/tasks', {headers: this.headers})
  }


  addTask(task: Partial<Task>): Observable<void> {
    return this.http.post<void>(this.url + '/task', task, { headers: this.headers })
  }


  updateTask(task: Partial<Task>): Observable<void> {
    const params = new HttpParams().set('_id', task.id)
    return this.http.put<void>(this.url + '/task', task, {
      params: params,
      headers: this.headers
    })
  }


  deleteTask(taskId: number): Observable<void> {
    const params = new HttpParams().set('_id', taskId)
    return this.http.delete<void>(this.url + '/delete', {
      params: params,
      headers: this.headers
    })
  }


  deleteAll(): Observable<void> {
    return this.http.delete<void>(this.url + '/del', {
      headers: this.headers
    })
  }


  deleteAllDone(): Observable<void> {
    return this.http.delete<void>(this.url + '/deldone', {
      headers: this.headers
    })
  }


  markAsDone(taskId: number, done: boolean): Observable<void> {
    const params = new HttpParams().set('_id', taskId)
    const body = {done: done}
    return this.http.patch<void>(this.url + '/done', body, {
      params: params,
      headers: this.headers
    })
  }


  markAsImportant(taskId: number, important: boolean): Observable<void> {
    const params = new HttpParams().set('_id', taskId)
    const body = {important: important}
    return this.http.patch<void>(this.url + '/important', body, {
      params: params,
      headers: this.headers
    })
  }


  updateSubtasks(taskId: number, subtasks: String): Observable<void> {
    const params = new HttpParams().set('_id', taskId)
    const body = {subtasks: subtasks}
    return this.http.patch<void>(this.url + '/subtasks', body, {
      params: params,
      headers: this.headers
    })
  }


  reorder(tasks: Task[]): Observable<void> {
    const body = { tasks: tasks }
    return this.http.post<void>(this.url + '/reorder', body, {
      headers: this.headers
    })
  }


  private setTokenHeader(token: string) { 
    this.headers = this.headers.set('Authorization', 'Bearer ' + token)
  }

}
