import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonReorderGroup, ItemReorderEventDetail, ToastController } from '@ionic/angular';
import { Note } from 'src/app/notes/note-model';
import { NotesService } from 'src/app/notes/notes.service';
import { isDevMode } from '@angular/core';
const dev = isDevMode() ? true : false


@Component({
  selector: 'app-notes-board',
  templateUrl: './notes-board.page.html',
  styleUrls: ['./notes-board.page.scss'],
})
export class NotesBoardPage {
  
  constructor(
    private notesService: NotesService,
    public toastController: ToastController,
  ) {
    this.subscribeNotes()
  }
    
  notes: Note[]

  private subscribeNotes = () => this.notesService
    .getNotes().subscribe($notes => this.notes = $notes)

  ionViewWillEnter = async () => await this.notesService.loadData()
  // ionViewWillLeave = () => this.notesService.killData()
  

  // REORDER

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  reorder = false

  reorderOn() {
    if (this.reorderGroup!.disabled) { 
      this.reorderGroup.disabled = false
      this.reorder = true
      this.reorderToast()
    }
  }

  reorderOff() {
    if (!this.reorderGroup!.disabled) { 
      this.reorderGroup.disabled = true
      this.reorder = false
      this.reorderToast()
    }
  }

  async reorderToast() {
    let msg = ''
    if (this.reorderGroup.disabled) {
      msg = 'Sortowanie zadań zostało wyłączone!'
    } else msg = 'Sortowanie zadań zostało włączone!'

    const toast = await this.toastController.create({
      header: 'Sortowanie '+(this.reorderGroup.disabled?'wyłączone!':'włączone!'),
      position: 'middle',
      duration: 500,
      cssClass: 'my-toast'
    });
    await toast.present();
  }

  doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    const from = event.detail.from
    const to = event.detail.to
    if (dev) console.log(`Dragged from index ${event.detail.from}, to ${event.detail.to}`);
    this.notesService.reorder(this.notes[from].id, this.notes[to].id)
    // dokonczyc animacje wracania
    event.detail.complete()
  }

}
