import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appReorderToggle]'
})
export class ReorderToggleDirective {

  @Output('appReorderToggle') emitter = new EventEmitter();

  constructor(
  ) { }

  private xStart: number = 0
  private yStart: number = 0
  private timestamp: number = 0
  private dx: number = 0
  private dy: number = 0

  @HostListener('touchmove', ['$event']) onMove(event: TouchEvent) { 
    if (this.active) {
      this.dx = Math.abs(event.changedTouches[0].clientX - this.xStart)
      this.dy = Math.abs(event.changedTouches[0].clientY - this.yStart)
      if (this.dx > 30 || this.dy > 30) {
        this.active = false
      }
    }
  }


  @HostListener('touchstart', ['$event']) onStart(event: TouchEvent) {
    this.timestamp = event.timeStamp
    this.xStart = event.touches[0].clientX
    this.yStart = event.touches[0].clientY
    this.initTimer(event)
  }

  @HostListener('touchend', ['$event']) onEnd(event: TouchEvent) {
    if (event.timeStamp - this.timestamp > 500) {
      this.dx = Math.abs(event.changedTouches[0].clientX - this.xStart)
      this.dy = Math.abs(event.changedTouches[0].clientY - this.yStart)
      if (this.dx < 50 && this.dy < 50) {
        if (this.active) {
          this.emit(event)
        }
      }
    }
    this.reset()
  }

  private active: boolean = false

  private initTimer(event: Event) {
    this.active = true
    setTimeout(() => {
      if (this.active) {
        this.emit(event)
        this.active = false
      }
    },500)
  }

  private emit(eventToStop: Event) {
    this.emitter.emit()
    eventToStop.stopPropagation()
    eventToStop.preventDefault()
    this.active = false
  }

  private reset() {
    this.xStart = 0
    this.yStart = 0
    this.timestamp = 0
    this.active = false
  }

}
