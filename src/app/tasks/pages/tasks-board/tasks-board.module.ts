import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TasksBoardPageRoutingModule } from './tasks-board-routing.module';
import { TasksBoardPage } from './tasks-board.page';
import { TaskComponent } from 'src/app/tasks/task-component/task.component';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LimitToPipeModule } from 'src/app/pipes/limit-to.pipe';
import { DeadlinePipe } from 'src/app/pipes/deadline.pipe';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
registerLocaleData(localePl);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksBoardPageRoutingModule,
    LimitToPipeModule,
    SharedDirectivesModule
  ],
  declarations: [
    TasksBoardPage,
    TaskComponent,
    DeadlinePipe,
  ],
})
export class TasksBoardPageModule { }
