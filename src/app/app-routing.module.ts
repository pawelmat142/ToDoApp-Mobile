import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
    // loadChildren: () => import('./pages/users-page/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users-page/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/pages/tasks-board/tasks-board.module').then( m => m.TasksBoardPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./notes/pages/notes-board/notes-board.module').then( m => m.NotesBoardPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login-page/login-page.module').then( m => m.LoginPagePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register-page/register-page.module').then( m => m.RegisterPagePageModule)
  },
  {
    path: 'add-task',
    loadChildren: () => import('./tasks/pages/adding-form/adding-form.module').then( m => m.AddingFormPageModule)
  },
  {
    path: 'edit-task',
    loadChildren: () => import('./tasks/pages/editing-form/editing-form.module').then( m => m.EditingFormPageModule)
  },
  {
    path: 'manual',
    loadChildren: () => import('./pages/manual/manual.module').then( m => m.ManualPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'add-note',
    loadChildren: () => import('./notes/pages/add-note/add-note.module').then( m => m.AddNotePageModule)
  },
  {
    path: 'edit-note',
    loadChildren: () => import('./notes/pages/edit-note/edit-note.module').then( m => m.EditNotePageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
