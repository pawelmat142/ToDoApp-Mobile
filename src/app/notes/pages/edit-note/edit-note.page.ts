import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Note, NoteParagraph } from 'src/app/notes/note-model';
import { NotesService } from 'src/app/notes/notes.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.page.html',
  styleUrls: ['./edit-note.page.scss'],
})
export class EditNotePage implements OnInit, OnDestroy, AfterViewInit {

  note: Note
  editForm: FormGroup
  

  constructor(
    private notesService: NotesService,
    public router: Router
  ) { }

  ngOnInit() {
    this.note = this.notesService.notes
      .find(note => note.id === this.notesService.editNoteId)
    this.initForm()
  }

  ngOnDestroy() {
    this.notesService.editNoteId = null
  }

  @ViewChildren('paragraphInputRef') paragraphInputRef

  ngAfterViewInit() {
    setTimeout(() => {
      this.paragraphInputRef.first.setFocus()
      const content = this.paragraphInputRef.first.value
      this.paragraphInputRef.first.value = ''
      this.paragraphInputRef.first.value = content
    },200)
  }


  private initForm() {
    this.editForm = new FormGroup<any>({})
    if (this.note.title) {
      const title = new FormControl(this.note.title)
      this.editForm.addControl('title', title)
    }
    this.note.paragraphs.forEach((paragraph, i) => {
      const p = new FormControl<string>(paragraph.content)
      const name = `paragraph-${i}`
      this.paragraphs.push(name)
      this.editForm.addControl(name, p)
    })
    this.pi = this.paragraphs.length
  }

  get f() { return this.editForm.controls }




  submitted = false
  message = ''
  messageErr = false


  onFocusout(): void {
    if (!this.submitted) { 
      this.submitted = true
    }
  }

  async onSubmit() {
    this.submitted = true
    if (this.editForm.invalid) return

    this.note.title = this.getTitle()
    this.note.paragraphs = this.getParagraphs()

    if (this.note.modified) {
      this.note.modified.push(Date.now())
    } else { 
      this.note.modified = [Date.now()]
    }

    let result = await this.notesService.editNote(this.note)
    this.message = result.message

    if (result.state) {
      setTimeout(() => this.router.navigateByUrl('/notes', { replaceUrl: true }), 500)
    } else { 
      this.messageErr = true
      setTimeout(() => {
        this.message = ''
        this.messageErr = false
      }, 5000)
    }
  }


  private getTitle(): string {
    if (this.editForm.controls.title.value) {
      return this.editForm.controls.title.value
    } else {
      const parts = this.editForm.controls[this.paragraphs[0]].value.split(' ')
      if (parts.length < 4) {
        return parts.join(' ')
      }
      else { 
        return `${parts[0]} ${parts[1]} ${parts[2]}`
      }
    }
  }


  // PARAGRAPHS

  paragraphs: string[] = []
  pi: number

  private getParagraphs(): NoteParagraph[] {
    let result: NoteParagraph[] = []
    result = this.paragraphs.map((p, index) => {
      return {
        order: index + 1,
        content: this.editForm.controls[p].value
      } as NoteParagraph
    }) as NoteParagraph[]
    return result
  }

  addParagraph(): void {
    const name = `paragraph-${this.pi++}`
    const formControl = new FormControl<string>('',[Validators.required])
    formControl.setValue('')
    this.editForm.addControl(name, formControl)
    this.paragraphs.push(name)
    setTimeout(() => { 
      this.paragraphInputRef.last.setFocus()
    }, 200)
  }

  removeParagraph(name: string): void {
    if (this.paragraphs.length === 1) {
      this.editForm.controls[this.paragraphs[0]].setValue('')
    } else { 
      this.paragraphs = this.paragraphs.filter(s => s !== name)
      this.editForm.removeControl(name)
    }
  }


}
