import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesBoardPageRoutingModule } from './notes-board-routing.module';

import { NotesBoardPage } from './notes-board.page';
import { NoteComponent } from 'src/app/notes/note-component/note.component';
import { HideScrollButtonDirective } from 'src/app/directives/hide-scroll-button';
import { SwipePageDirective } from 'src/app/directives/swipe-page.directive';
import { ReorderToggleDirective } from 'src/app/directives/reorder-toggle.directive';
import { LastPipe } from 'src/app/pipes/last.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesBoardPageRoutingModule
  ],
  declarations: [
    NotesBoardPage,
    NoteComponent,
    HideScrollButtonDirective,
    SwipePageDirective,
    ReorderToggleDirective,
    LastPipe
  ]
})
export class NotesBoardPageModule {}
