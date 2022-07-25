import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksBoardPageRoutingModule } from './tasks-board-routing.module';

import { TasksBoardPage } from './tasks-board.page';
import { TaskComponent } from 'src/app/components/task/task.component';

import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LimitToPipe } from 'src/app/pipes/limit-to.pipe';
import { DeadlinePipe } from 'src/app/pipes/deadline.pipe';
registerLocaleData(localePl);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksBoardPageRoutingModule,
  ],
  declarations: [TasksBoardPage, TaskComponent, LimitToPipe, DeadlinePipe]
})
export class TasksBoardPageModule {}
