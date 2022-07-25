import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddingFormPage } from './adding-form.page';

const routes: Routes = [
  {
    path: '',
    component: AddingFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddingFormPageRoutingModule {}
