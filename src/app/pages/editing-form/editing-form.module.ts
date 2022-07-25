import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditingFormPageRoutingModule } from './editing-form-routing.module';

import { EditingFormPage } from './editing-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditingFormPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditingFormPage]
})
export class EditingFormPageModule {}
