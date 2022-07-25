import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddingFormPageRoutingModule } from './adding-form-routing.module';

import { AddingFormPage } from './adding-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddingFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddingFormPage]
})
export class AddingFormPageModule {}
