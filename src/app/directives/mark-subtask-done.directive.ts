import { Directive, HostListener, Input } from '@angular/core';
import { TasksService } from '../tasks/tasks.service';

@Directive({
  selector: '[appMarkSubtaskDone]'
})
export class MarkSubtaskDoneDirective {

  @Input('taskId') taskId: string
  @Input('subtaskIndex') subtaskIndex: number

  constructor(
    private tasksService: TasksService
  ) { }

  private xStart: number = 0
  private yStart: number = 0
  private touched: boolean = false

  @HostListener('touchstart', ['$event']) onStart(event: TouchEvent) {
    this.touched = true
    this.xStart = event.touches[0].clientX
    this.yStart = event.touches[0].clientY
  }

  @HostListener('touchend', ['$event']) onEnd(event: TouchEvent) {
    if (this.touched) {
      const dx = Math.abs(event.changedTouches[0].clientX - this.xStart)
      const dy = Math.abs(event.changedTouches[0].clientY - this.yStart)

      if (dx < 50 && dy < 50) {
        console.log('mark')
        this.tasksService.markSubtaskAsDone(this.taskId, this.subtaskIndex)
      }
      // event.stopPropagation()
      // event.preventDefault()
    }
    this.reset()
  }

  private reset() {
    this.xStart = 0
    this.yStart = 0
    this.touched = false
  }
}
