import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotesBoardPageRoutingModule } from './notes-board-routing.module';
import { NotesBoardPage } from './notes-board.page';
import { NoteComponent } from 'src/app/notes/note-component/note.component';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesBoardPageRoutingModule,
    SharedDirectivesModule,
    SharedPipesModule
  ],
  declarations: [
    NotesBoardPage,
    NoteComponent,
  ]
})
export class NotesBoardPageModule {}
