import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TasksBoardPageRoutingModule } from './tasks-board-routing.module';
import { TasksBoardPage } from './tasks-board.page';
import { TaskComponent } from 'src/app/tasks/task-component/task.component';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';
registerLocaleData(localePl);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksBoardPageRoutingModule,
    SharedDirectivesModule,
    SharedPipesModule
  ],
  declarations: [
    TasksBoardPage,
    TaskComponent,
  ],
})
export class TasksBoardPageModule { }
