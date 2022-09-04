import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideScrollButtonDirective } from './hide-scroll-button';
import { MarkDoneDirective } from './mark-done.directive';
import { MarkSubtaskDoneDirective } from './mark-subtask-done.directive';
import { ReorderToggleDirective } from './reorder-toggle.directive';
import { SwipePageDirective } from './swipe-page.directive';

@NgModule({
  declarations: [
    HideScrollButtonDirective,
    MarkDoneDirective,
    MarkSubtaskDoneDirective,
    ReorderToggleDirective,
    SwipePageDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HideScrollButtonDirective,
    MarkDoneDirective,
    MarkSubtaskDoneDirective,
    ReorderToggleDirective,
    SwipePageDirective
  ]
})
export class SharedDirectivesModule { }
