import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subtask } from 'src/app/models/task';
import { Task } from 'src/app/models/task';
import { IdService } from 'src/app/services/id.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-adding-form',
  templateUrl: './adding-form.page.html',
  styleUrls: ['./adding-form.page.scss'],
})
export class AddingFormPage implements OnInit, AfterViewInit {

  constructor(
    private tasksService: TasksService,
    public router: Router,
    private id: IdService
  ) { }

  ngOnInit() { }
  
  ngAfterViewInit() {
    setTimeout(() => { 
      this.taskInputRef.setFocus()
    },200)
  }
  
  addingForm = new FormGroup<any>({
    name: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    deadline: new FormControl<string>(''),
    done: new FormControl<boolean>(false),
    important: new FormControl<boolean>(false)
  })

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

    this.submitted = true
    if (this.addingForm.invalid) return

    const newTask: Task = {
      id: this.id.generate(), 
      user_id: this.tasksService.uid,
      name: this.addingForm.controls.name.value,
      important: this.addingForm.controls.important.value,
      done: this.addingForm.controls.done.value,
    }

    if (this.addingForm.controls.deadline.value) { 
      newTask.deadline = this.addingForm.controls.deadline.value
    }
    if (this.subtasks?.length) { 
      newTask.subtasks = this.getSubtasks()
    }
    let result = await this.tasksService.addTask(newTask)
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
  
  subtasks: string[] = []
  si: number = 0
  
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
