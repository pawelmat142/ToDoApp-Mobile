import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesBoardPageRoutingModule } from './notes-board-routing.module';

import { NotesBoardPage } from './notes-board.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesBoardPageRoutingModule
  ],
  declarations: [NotesBoardPage]
})
export class NotesBoardPageModule {}
