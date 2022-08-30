import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Note, NoteParagraph } from 'src/app/notes/note-model';
import { IonAccordionGroup, ToastController } from '@ionic/angular';
import { NotesService } from 'src/app/notes/notes.service';
import { Router } from '@angular/router';
import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit, AfterViewInit {

  @Input() note: Note
  @Input() index: number

  @ViewChild('accordionRef') accordionRef: IonAccordionGroup

  constructor(
    private notesService: NotesService,
    public toastController: ToastController,
    public router: Router,
  ) { }

  paragraphs: NoteParagraph[] = []

  // css class flags
  accordionExpanded: boolean = false
  noteImportant: boolean

  get lastModified(): number {
    return this.note.modified[this.note.modified.length - 1]
  }

  ngOnInit() {
    if (this.note.paragraphs && this.note.paragraphs.length) {
      this.paragraphs = this.note.paragraphs
    }
    this.noteImportant = this.note.important
  }

  ngAfterViewInit() {
    if (this.note.open) {
      this.accordionRef.value = `${this.index}`
    }
  }
  

  accordion() {
    if (this.accordionRef.value === `${this.index}`) {
      this.accordionExpanded = true
      this.note.open = true
    } else { 
      this.accordionExpanded = false
      this.note.open = false
    }
  }

  removeNote() {
    this.removeNoteAlert()
  }

  edit() {
    this.notesService.editNoteId = this.note.id
    this.router.navigateByUrl('/edit-note', { replaceUrl: true })
  }

  important() { 
    this.noteImportant = this.notesService.important(this.note.id)
  }

  private async removeNoteAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Uwaga';
    alert.subHeader = this.note.title
    alert.message = 'Czy na pewno chcesz usunąć?';
    alert.cssClass = 'my-alert-wrapper';
    alert.buttons = [{
      text: 'Nie',
      role: 'cancel',
    },{
      text: 'Tak',
      role: 'confirm',
      handler: () => this.notesService.removeNote(this.note.id)
    }];
    document.body.appendChild(alert);
    await alert.present();
  }


  // OTHERS

  private limitToPipe(value: string, args: number) {
    let limit = args ? args : 10;
    let trail = '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}
