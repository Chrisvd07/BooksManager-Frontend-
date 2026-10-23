import { Routes } from '@angular/router';

export const AUTHORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./author-list/author-list.component').then(m => m.AuthorListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./author-form-page/author-form-page.component').then(m => m.AuthorFormPageComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./author-form-page/author-form-page.component').then(m => m.AuthorFormPageComponent)
  }
];
