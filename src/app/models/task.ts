export interface Task { 
  id: string, 
  user_id: string,
  name: string,
  important: boolean,
  deadline?: Date,
  done: boolean,
  subtasks?: Subtask[],
}

export interface Subtask {
  name: string;
  done: boolean;
}