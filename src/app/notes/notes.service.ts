import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable} from 'rxjs'
import { UserService } from 'src/app/users/user.service'
import { Storage } from '@ionic/storage-angular'
import { environment } from '../../environments/environment'
import { Note } from './note-model'
import { dataRespone } from '../models/dataResponse'
import { IdService } from '../services/id.service'

import { isDevMode } from '@angular/core'
const dev = isDevMode() ? true : false


@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private notesObs = new BehaviorSubject<Note[]>([])
  private notesSnapshot: Note[] = []

  constructor(
    private storage: Storage,
    private userService: UserService,
    private id: IdService
  ) {
    if (dev) console.log('notes service init')
    this.notesObs.subscribe(n => {
      this.notesSnapshot = n ? n : []
      if (dev) console.log('notes service subscribe')
    })
  }

  public async loadData() {
    if (dev) console.log(`load data NOTES, key: ${this.KEY}`)
    const tasks = await this.storage.get(this.KEY) as Note[] || []
    this.notesObs.next(tasks)
  }

  public killData = () => this.notesObs.next([])


  get notes(): Note[] {
    return this.notesSnapshot
  }

  public getNotes(): Observable<Note[]> {
    return this.notesObs.asObservable()
  }

  public clearObservable(): void {
    this.notesObs.next([])
  }

  public async addNote(note: Partial<Note>): Promise<dataRespone> {
    const newNote: Note = this.prepereNewNote(note)
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    const success = await this.setNotes([...this.notesSnapshot, newNote] as Note[])
    if (success) {
      result.state = true
      result.message = `Dodano notatke!`
    } else { 
      result.message = `Błąd!`
    }
    return result
  }

  public async editNote(newNote: Note): Promise<dataRespone> {
    let result: dataRespone = {
      state: false,
      message: 'Nieznany bład!'
    }
    const i = this.notesSnapshot.findIndex(n => n.id === newNote.id)
    this.notesSnapshot.splice(i, 1, newNote)

    const success = await this.setNotes(this.notesSnapshot)
    
    if (success) {
      result.state = true
      result.message = `notatke edytowano!`
    } else { 
      result.message = `Błąd!`
    }
    return result
  }

  public important(noteId: string): boolean {
    const note = this.notesSnapshot.find(note => note.id === noteId)
    note.important = !note.important
    this.setNotes(this.notesSnapshot)
    return note.important
  }

  public removeNote(noteId: string): void {
    const newNote = this.notesSnapshot.filter(note => note.id !== noteId)
    this.setNotes(newNote)
  }

  private prepereNewNote(newNote: Partial<Note>): Note {
    return {
      id: this.id.generate(),
      user_id: this.uid,
      title: newNote.title,
      paragraphs: newNote.paragraphs,
      created: Date.now(),
      important: false,
    }
  }


  // REORDER

  async reorder(fromId: string, toId: string): Promise<void> {
    const fromIndex = this.notes.findIndex(t => t.id === fromId)
    const toIndex = this.notes.findIndex(t => t.id === toId)

    let result = copy(this.notes)
    const noteToMove = result.splice(fromIndex, 1).pop()
    result.splice(toIndex, 0, noteToMove)
    
    await this.setNotes(result)
  }


  private note = (id: string) => this.notes.find(note => note.id === id)


  // STORAGE

  get uid(): string {
    return this.userService.id
  }
    
  get KEY(): string {
    if (this.userService.id) { 
      return `${environment.dataUsersKey}_${this.uid}_notes`
    } else return ''
  }

  private async setNotes(notes: Note[]): Promise<Boolean> {
    const notesBefore = this.notesSnapshot
    try {
      this.notesObs.next(notes)
      await this.storage.set(this.KEY, notes)
      return true
    } catch (error) {
      this.notesObs.next(notesBefore)
      return false
    }
  }

  // EDIT FORM
  editNoteId: string
}

const copy = (item: any) => JSON.parse(JSON.stringify(item))