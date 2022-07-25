import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
    // loadChildren: () => import('./pages/users-page/users.module').then( m => m.UsersPageModule)
    // loadChildren: () => import('./pages/login-page/login-page.module').then( m => m.LoginPagePageModule)
    // loadChildren: () => import('./pages/register-page/register-page.module').then( m => m.RegisterPagePageModule)
    // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
    loadChildren: () => import('./pages/tasks-board/tasks-board.module').then( m => m.TasksBoardPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./pages/notes-board/notes-board.module').then( m => m.NotesBoardPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register-page/register-page.module').then( m => m.RegisterPagePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login-page/login-page.module').then( m => m.LoginPagePageModule)
  },
  {
    path: 'add-task',
    loadChildren: () => import('./pages/adding-form/adding-form.module').then( m => m.AddingFormPageModule)
  },
  {
    path: 'edit-task',
    loadChildren: () => import('./pages/editing-form/editing-form.module').then( m => m.EditingFormPageModule)
  },
  {
    path: 'manual',
    loadChildren: () => import('./pages/manual/manual.module').then( m => m.ManualPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
