import { Directive, ElementRef, HostBinding, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { DomController, IonFab } from '@ionic/angular';

@Directive({
  selector: '[appShowWhen]'
})
export class ShowWhenDirective implements OnChanges {

  @Input('reorder') reorder: boolean

  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController,
    private el: ElementRef,
  ) { }

  private dy = 20

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }


    

      // this.domCtrl.write(() => {
      //   this.renderer.setStyle(this.el, 'transform', `translateY(${this.dy}px)`)
      // })


}
