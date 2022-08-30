import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2, ViewChildren } from '@angular/core';
import { DomController, IonFab } from '@ionic/angular';
import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false


@Directive({
  selector: '[appHideScrollButton]'
})
export class HideScrollButtonDirective implements AfterViewInit {

  private buttons: NodeList
  private dy: number = 0

  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController,
    private el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.initHideScrollButtons()
  }

  private initHideScrollButtons() {
    this.buttons = document.querySelectorAll('.hide-scroll-button')
    if (dev) console.log(`${this.buttons.length} hide scroll buttons initialized`)
    if (this.buttons.length === 0) setTimeout(() => this.initHideScrollButtons(),1000)
  }

  @HostListener('ionScroll', ['$event']) onScroll(event: CustomEvent) {

    this.dy = this.dy + event.detail.deltaY*2

    if (this.dy > 100) this.dy = 100
    if (this.dy < 0) this.dy = 0

    this.buttons.forEach(b => {
      this.domCtrl.write(() => {
        this.renderer.setStyle(b, 'transform', `translateY(${this.dy}px)`)
      })
    })

  }


}
