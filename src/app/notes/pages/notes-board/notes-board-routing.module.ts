import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotesBoardPage } from './notes-board.page';

const routes: Routes = [
  {
    path: '',
    component: NotesBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesBoardPageRoutingModule {}
