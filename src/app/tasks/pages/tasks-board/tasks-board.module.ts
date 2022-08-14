import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksBoardPageRoutingModule } from './tasks-board-routing.module';

import { TasksBoardPage } from './tasks-board.page';
import { TaskComponent } from 'src/app/tasks/task-component/task.component';

import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LimitToPipe, LimitToPipeModule } from 'src/app/pipes/limit-to.pipe';
import { DeadlinePipe } from 'src/app/pipes/deadline.pipe';
import { HideScrollButtonDirective } from "src/app/directives/hide-scroll-button";
import { SwipePageDirective } from 'src/app/directives/swipe-page.directive';
import { MarkDoneDirective } from 'src/app/directives/mark-done.directive';
import { ReorderToggleDirective } from 'src/app/directives/reorder-toggle.directive';
registerLocaleData(localePl);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksBoardPageRoutingModule,
    LimitToPipeModule,
  ],
  declarations: [
    TasksBoardPage,
    TaskComponent,
    DeadlinePipe,
    HideScrollButtonDirective,
    SwipePageDirective,
    MarkDoneDirective,
    ReorderToggleDirective
  ],
})
export class TasksBoardPageModule { }
