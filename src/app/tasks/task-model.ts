export interface Task { 
  id: string, 
  user_id: string,
  name: string,
  important: boolean,
  deadline?: Date,
  done: boolean,
  subtasks?: Subtask[],
  open?: boolean
  modifiedOffline?: boolean
}

export interface TaskOnline { 
  id?: string, 
  userId?: string,
  name: string,
  important: boolean,
  deadline?: Date,
  done: boolean,
  subtasks?: string,
}

export interface Subtask {
  name: string;
  done: boolean;
}