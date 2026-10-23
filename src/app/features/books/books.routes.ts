import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./book-list/book-list.component').then(m => m.BookListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./book-form-page/book-form-page.component').then(m => m.BookFormPageComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./book-form-page/book-form-page.component').then(m => m.BookFormPageComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./book-detail/book-detail.component').then(m => m.BookDetailComponent)
  }
];
