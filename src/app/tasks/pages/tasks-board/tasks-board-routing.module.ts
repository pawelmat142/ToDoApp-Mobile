import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasksBoardPage } from './tasks-board.page';

const routes: Routes = [
  {
    path: '',
    component: TasksBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksBoardPageRoutingModule {}
