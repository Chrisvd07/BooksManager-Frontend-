import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'books',
        loadChildren: () => import('./features/books/books.routes').then(m => m.BOOKS_ROUTES)
      },
      {
        path: 'authors',
        loadChildren: () => import('./features/authors/authors.routes').then(m => m.AUTHORS_ROUTES)
      },
      {
        path: '',
        redirectTo: 'books',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'books'
  }
];
