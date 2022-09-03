import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

const XMAX: number = 30
const YMAX: number = 30
const TIMEOUT: number = 700

@Directive({
  selector: '[appReorderToggle]'
})
export class ReorderToggleDirective {

  @Output('appReorderToggle') emitter = new EventEmitter();

  constructor(
  ) { }

  private touched: boolean

  private xStart: number = 0
  private yStart: number = 0
  private dx: number = 0
  private dy: number = 0

  private timeout: any
  

  @HostListener('touchmove', ['$event']) onMove(event: TouchEvent) { 
    if (this.touched) {
      this.dx = Math.abs(event.changedTouches[0].clientX - this.xStart)
      this.dy = Math.abs(event.changedTouches[0].clientY - this.yStart)
      if (this.dx > XMAX || this.dy > YMAX) {
        this.reset()
      }
    }
  }


  @HostListener('touchstart', ['$event']) onStart(event: TouchEvent) {
    this.touched = true
    this.timeout = setTimeout(() => this.emit(event), TIMEOUT)
  }

  @HostListener('touchend', ['$event']) onEnd(event: TouchEvent) {
    this.reset()
  }


  private emit(eventToStop: Event) {
    if (this.touched) {
      eventToStop.stopPropagation()
      eventToStop.preventDefault()
      this.reset()
      this.emitter.emit()
    } 
    else this.reset()
  }

  private reset() {
    clearTimeout(this.timeout)
    this.touched = false
    this.xStart = 0
    this.yStart = 0
  }

}
