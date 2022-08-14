export interface Note {
  id: string
  user_id: string
  title: string
  paragraphs: NoteParagraph[]
  created: number
  modified?: [number]
  important: boolean
  open?: boolean
}

export interface NoteParagraph {
  order: number;
  content: string;
}