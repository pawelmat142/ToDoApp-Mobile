import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { TasksService } from '../tasks/tasks.service';

@Directive({
  selector: '[appMarkDone]'
})
export class MarkDoneDirective {

  @Input('taskId') taskId: string

  constructor(
    private tasksService: TasksService
  ) { }

  private xStart: number = 0
  private yStart: number = 0
  private timestamp: number = 0
  private dx: number = 0
  private dy: number = 0

  @HostListener('touchstart', ['$event']) onStart(event: TouchEvent) {
    this.timestamp = event.timeStamp
    this.xStart = event.touches[0].clientX
    this.yStart = event.touches[0].clientY
  }

  @HostListener('touchend', ['$event']) onEnd(event: TouchEvent) {
    if (event.timeStamp - this.timestamp < 200) {
      this.dx = Math.abs(event.changedTouches[0].clientX - this.xStart)
      this.dy = Math.abs(event.changedTouches[0].clientY - this.yStart)

      if (this.dx < 50 && this.dy < 50) {
        event.stopPropagation()
        event.preventDefault()
        this.tasksService.markAsDone(this.taskId)
      }
    }
    this.reset()
  }

  private reset() {
    this.xStart = 0
    this.yStart = 0
    this.timestamp = 0
  }

}
