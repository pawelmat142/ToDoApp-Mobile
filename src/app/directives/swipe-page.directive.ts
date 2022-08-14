import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appSwipePage]'
})
export class SwipePageDirective {

  constructor(
    public router: Router,
  ) { }

  private xStart: number = 0
  private yStart: number = 0
  private timestamp: number = 0

  @HostListener('touchstart', ['$event']) onStart(event: TouchEvent) {
    this.timestamp = event.timeStamp
    this.xStart = event.touches[0].clientX
    this.yStart = event.touches[0].clientY
  }

  @HostListener('touchend', ['$event']) onEnd(event: TouchEvent) {
    if (event.timeStamp - this.timestamp < 300) {
      const dx = Math.abs(event.changedTouches[0].clientX - this.xStart)
      const dy = Math.abs(event.changedTouches[0].clientY - this.yStart)
      this.swipe(dx, dy)
    }
    this.reset()
  }


  private swipe(dx: number, dy: number) {
    if (dx > 150 && dy < 100) {
      this.navigate()
    }
  }

  private navigate() {
    if (this.router.url === '/tasks') {
      this.router.navigateByUrl('/notes', { replaceUrl: true })
    }
    else if (this.router.url === '/notes') {
      this.router.navigateByUrl('/tasks', { replaceUrl: true })
    } 
  }


  private reset() {
    this.xStart = 0
    this.yStart = 0
    this.timestamp = 0
  }

}
