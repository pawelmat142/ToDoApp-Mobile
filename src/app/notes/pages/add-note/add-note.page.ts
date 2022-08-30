import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Note, NoteParagraph } from 'src/app/notes/note-model';
import { NotesService } from 'src/app/notes/notes.service';
import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit, AfterViewInit {

  constructor(
    private notesService: NotesService,
    public router: Router,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => { 
      this.contentRef.setFocus()
    },200)
  }

  addingForm = new FormGroup<any>({
    title: new FormControl<string>(''),
    content: new FormControl<string>('', [Validators.required]),
  })

  get f() { return this.addingForm.controls }

  @ViewChild('contentRef') contentRef

  @ViewChildren('paragraphInputRef') paragraphInputRef

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
    if (this.addingForm.invalid) return

    const newNote: Partial<Note> = {
      title: this.getTitle(),
      paragraphs: this.getParagraphs()
    }

    let result = await this.notesService.addNote(newNote)
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
    if (this.addingForm.controls.title.value) {
      return this.addingForm.controls.title.value
    } else {
      const parts = this.addingForm.controls.content.value.split(' ')
      if (parts.length < 4) {
        return parts.join(' ')
      }
      else { 
        return `${parts[0]} ${parts[1]} ${parts[2]}`
      }
    }
  }


  // paragraphs

  paragraphs: string[] = []
  pi: number = 0

  private getParagraphs(): NoteParagraph[] {
    let result: NoteParagraph[] = []
    const firstParagraph = {
      content: this.addingForm.controls.content.value,
      order: 0
    }
    if (this.paragraphs.length) {
      result = this.paragraphs.map((p, index) => {
        return {
          order: index + 1,
          content: this.addingForm.controls[p].value
        } as NoteParagraph
      }) as NoteParagraph[]
      result.unshift(firstParagraph)
    } 
    else {
      result = [firstParagraph]
    }
    return result
  }

  addParagraph(): void {
    const name = `paragraph-${this.pi++}`
    const formControl = new FormControl<string>('',[Validators.required])
    this.addingForm.addControl(name, formControl)
    this.paragraphs.push(name)
    setTimeout(() => { 
      this.paragraphInputRef.last.setFocus()
    },200)
  }

  removeParagraph(name: string): void {
    this.paragraphs = this.paragraphs.filter(s => s !== name)
    this.addingForm.removeControl(name)
  }



}
