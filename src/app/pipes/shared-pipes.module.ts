import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlinePipe } from './deadline.pipe';
import { LimitToPipe } from './limit-to.pipe';
import { LastPipe } from './last.pipe';

@NgModule({
  declarations: [
    DeadlinePipe,
    LimitToPipe,
    LastPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DeadlinePipe,
    LimitToPipe,
    LastPipe
  ]
})
export class SharedPipesModule { }
