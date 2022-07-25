import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task';
import { TasksService } from 'src/app/services/tasks.service';
import { Subtask } from 'src/app/models/task';

@Component({
  selector: 'app-editing-form',
  templateUrl: './editing-form.page.html',
  styleUrls: ['./editing-form.page.scss'],
})
export class EditingFormPage implements OnInit, OnDestroy {

  task: Task
  addingForm: FormGroup
  subtasks: string[] = []
  si: number

  constructor(
    private tasksService: TasksService,
    private router: Router
  ) { }

  ngOnInit() {
    this.task = this.tasksService.tasks
      .find(task => task.id === this.tasksService.editingTaskId)
    
    this.initForm()
  }

  ngOnDestroy() {
    this.tasksService.editingTaskId = null
  }

  private initForm() {
    this.addingForm = new FormGroup<any>({
      name: new FormControl<string>(this.task.name, [Validators.required, Validators.maxLength(100)]),
      done: new FormControl<boolean>(this.task.done),
      important: new FormControl<boolean>(this.task.important)
    })

    if (this.task.deadline) { 
      const deadline = new FormControl(this.task.deadline)
      this.addingForm.addControl('deadline', deadline)
    }

    if (this.task.subtasks && this.task.subtasks.length) { 
      this.task.subtasks.forEach((subtask, i) => {
        const s = new FormControl<string>(subtask.name)
        const name = `subtask-${i + 1}`
        this.subtasks.push(name)
        this.addingForm.addControl(name, s)
      })
      this.si = this.subtasks.length-1
    }
  }

  get f() { return this.addingForm.controls }

  @ViewChildren('subtaskInputReference') subtaskInputReference

  @ViewChild('datetimeReference') datetimeReference: ElementRef

  @ViewChild('taskInputRef') taskInputRef
  
  @ViewChild('accordionRef') accordionRef

  submitted = false

  message = ''
  messageErr = false

  onFocusout(): void {
    if (!this.submitted) { 
      this.submitted = true
    }
  }

  async onSubmit() {

    if (this.addingForm.invalid) return

    const newTask: Task = {
      id: this.task.id, 
      user_id: this.task.user_id,
      name: this.addingForm.controls.name.value,
      important: this.addingForm.controls.important.value,
      done: this.addingForm.controls.done.value,
    }

    if (this.addingForm.controls.deadline?.value) { 
      newTask.deadline = this.addingForm.controls.deadline.value
    }
    if (this.subtasks?.length) { 
      newTask.subtasks = this.getSubtasks()
    }
    let result = await this.tasksService.editTask(newTask)
    this.message = result.message

    if (result.state) {
      setTimeout(() => this.router.navigateByUrl('/tasks', { replaceUrl: true }), 500)
    } else { 
      this.messageErr = true
      setTimeout(() => {
        this.message = ''
        this.messageErr = false
      }, 5000)
    }
  }


  // subtasks

  private getSubtasks(): Subtask[] {
    return this.subtasks.map(s => {
      return {
        name: this.addingForm.controls[s].value,
        done: false
      }
    })
  }
  
  addSubtask(): void {
    const name = `subtask-${this.si++}`
    const formControl = new FormControl<string>('',[Validators.required, Validators.maxLength(50)])
    this.addingForm.addControl(name, formControl)
    this.subtasks.push(name)
    setTimeout(() => { 
      this.subtaskInputReference.last.setFocus()
    },200)
  }

  removeSubtask(name: string): void {
    this.subtasks = this.subtasks.filter(s => s !== name)
    this.addingForm.removeControl(name)
  }


  // deadline

  onDeadlineChange(event: CustomEvent): void {
    if (!this.f.deadline) { 
      this.addingForm.addControl('deadline', new FormControl<string>(''))
    }
    const deadline = new Date(event.detail.value)
    this.addingForm.controls.deadline.setValue(this.getDeadline(deadline))

    this.accordionRef.value = ""
    
    const datetime = document.querySelector('ion-datetime')
    datetime.reset()
  }

  onDeadlineCanel() {
    this.addingForm.controls.deadline.setValue('')
    
    this.accordionRef.value = ""
    
    const datetime = document.querySelector('ion-datetime')
    datetime.reset()
  }

  private getDeadline(date: Date): string {
    let month = date.getMonth().toString()
    if (month.length < 2) {
      month = `0${month}`
    }
    return `${date.getDay()}.${month} - ${date.getHours()}:${date.getMinutes()}` 
  }



}
