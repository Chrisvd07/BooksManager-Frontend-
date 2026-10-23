import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { Book, Author } from '../../../core/models/book.model';
import { BookFormComponent } from '../book-form/book-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="detail-container fade-in-up" *ngIf="book">
      <!-- NAVEGACIÓN Y ACCIONES -->
      <div class="top-bar">
        <a routerLink="/books" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Library</span>
        </a>

        <div class="action-buttons">
          <button class="btn-action edit-btn" (click)="openEditDialog()" matTooltip="Editar libro">
            <mat-icon>edit</mat-icon>
            <span>Edit Book</span>
          </button>
          <button class="btn-action delete-btn" (click)="deleteBook()" matTooltip="Eliminar libro">
            <mat-icon>delete_outline</mat-icon>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <!-- LAYOUT FLEXBOX (SIN GRID) -->
      <div class="detail-flex">
        <!-- COLUMNA LATERAL (PORTADA Y METADATOS REALES) -->
        <aside class="sidebar-col">
          <!-- PORTADA CON ESTILO DE LIBRO -->
          <div class="book-cover-card">
            <div class="cover-spine-edge"></div>
            <div class="cover-content">
              <span class="cover-id">ID: #{{ book.id }}</span>
              <mat-icon class="cover-icon">auto_stories</mat-icon>
              <h2 class="cover-book-title">{{ book.title }}</h2>
            </div>
          </div>

          <!-- ESTADÍSTICAS RÁPIDAS (SOLO DATOS DE LA API) -->
          <div class="stats-card">
            <div class="stat-row">
              <div class="stat-icon-wrap">
                <mat-icon>menu_book</mat-icon>
              </div>
              <div class="stat-text">
                <span class="stat-label">Pages</span>
                <span class="stat-value">{{ book.pageCount }}</span>
              </div>
            </div>

            <div class="stat-row">
              <div class="stat-icon-wrap">
                <mat-icon>event</mat-icon>
              </div>
              <div class="stat-text">
                <span class="stat-label">Published</span>
                <span class="stat-value">{{ book.publishDate | date:'longDate' }}</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- CONTENIDO PRINCIPAL (DATOS REALES) -->
        <main class="main-col">
          <!-- TÍTULO PRINCIPAL -->
          <div class="header-box">
            <h1 class="book-title">{{ book.title }}</h1>
          </div>

          <!-- AUTORES RELACIONADOS -->
          <section class="info-section">
            <h3 class="section-title">Related Authors</h3>

            <!-- FLEXBOX DE AUTORES -->
            <div class="authors-flex" *ngIf="relatedAuthors.length > 0">
              <div class="author-card" *ngFor="let author of relatedAuthors">
                <div class="author-avatar">
                  {{ (author.firstName ? author.firstName[0] : 'A') | uppercase }}
                </div>
                <div class="author-info">
                  <span class="author-name">{{ author.firstName }} {{ author.lastName }}</span>
                  <span class="author-role">Author</span>
                </div>
              </div>
            </div>

            <p class="no-data-msg" *ngIf="relatedAuthors.length === 0">
              No related authors found for this book.
            </p>
          </section>

          <!-- EXTRACTO -->
          <section class="info-section" *ngIf="book.excerpt">
            <h3 class="section-title">Excerpt</h3>
            <div class="excerpt-card">
              <p class="excerpt-text">{{ book.excerpt }}</p>
            </div>
          </section>

          <!-- DESCRIPCIÓN -->
          <section class="info-section" *ngIf="book.description">
            <h3 class="section-title">Description</h3>
            <div class="description-card">
              <p class="description-text">{{ book.description }}</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 36px 48px;
    }

    /* TOP BAR */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      padding: 8px 16px;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      transition: all 0.2s ease;
    }
    .back-btn:hover {
      background: #eff6ff;
      border-color: #bfdbfe;
      transform: translateX(-2px);
    }
    .back-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 36px;
      padding: 0 16px;
      border-radius: 18px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-action mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .edit-btn {
      background: #2563eb;
      color: #ffffff;
    }
    .edit-btn:hover {
      background: #1d4ed8;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .delete-btn {
      background: #ffffff;
      color: #ef4444;
      border: 1px solid #fecaca;
    }
    .delete-btn:hover {
      background: #fee2e2;
    }

    /* LAYOUT FLEXBOX (NO GRID) */
    .detail-flex {
      display: flex;
      align-items: flex-start;
      gap: 32px;
      flex-wrap: wrap;
    }

    /* COLUMNA LATERAL */
    .sidebar-col {
      flex: 0 0 320px;
      max-width: 340px;
      min-width: 280px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* PORTADA DEL LIBRO */
    .book-cover-card {
      width: 100%;
      min-height: 380px;
      background: linear-gradient(145deg, #1e3a8a 0%, #0f172a 100%);
      border-radius: 14px;
      position: relative;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.18);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cover-spine-edge {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 12px;
      background: linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.3) 100%);
      border-right: 1px solid rgba(0, 0, 0, 0.3);
    }

    .cover-content {
      flex: 1;
      padding: 28px 24px 28px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #ffffff;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .cover-id {
      align-self: flex-start;
      font-size: 11px;
      font-family: monospace;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .cover-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      margin: 20px auto 10px;
      color: #60a5fa;
      opacity: 0.9;
    }

    .cover-book-title {
      font: 700 22px/1.25 'Outfit', sans-serif;
      color: #ffffff;
      margin: 0;
    }

    /* ESTADÍSTICAS RÁPIDAS (SOLO CAMPOS REALES) */
    .stats-card {
      background: #ffffff;
      border-radius: 14px;
      padding: 20px 22px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .stat-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .stat-icon-wrap {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon-wrap mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .stat-text {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      font-weight: 500;
    }

    .stat-value {
      font-size: 14px;
      color: #0f172a;
      font-weight: 600;
      margin-top: 2px;
    }

    /* COLUMNA PRINCIPAL */
    .main-col {
      flex: 1 1 500px;
      min-width: 320px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .header-box {
      background: #ffffff;
      border-radius: 14px;
      padding: 28px 32px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    }

    .book-title {
      font: 800 36px/1.15 'Outfit', sans-serif;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.5px;
    }

    /* SECCIONES DE CONTENIDO */
    .info-section {
      background: #ffffff;
      border-radius: 14px;
      padding: 24px 30px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    }

    .section-title {
      font: 700 18px/1 'Outfit', sans-serif;
      color: #0f172a;
      margin: 0 0 16px 0;
    }

    /* AUTORES (FLEXBOX) */
    .authors-flex {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .author-card {
      flex: 1 1 calc(50% - 12px);
      min-width: 220px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }

    .author-avatar {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #2563eb;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font: 700 14px/1 'Outfit', sans-serif;
      flex-shrink: 0;
    }

    .author-info {
      display: flex;
      flex-direction: column;
    }

    .author-name {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }

    .author-role {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }

    .no-data-msg {
      color: #64748b;
      font-size: 13.5px;
      margin: 0;
      font-style: italic;
    }

    /* EXTRACTO */
    .excerpt-card {
      background: #f8fafc;
      border-left: 4px solid #2563eb;
      border-radius: 0 10px 10px 0;
      padding: 18px 22px;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }

    .excerpt-text {
      font-size: 14.5px;
      font-style: italic;
      line-height: 1.7;
      color: #334155;
      margin: 0;
      white-space: pre-line;
    }

    /* DESCRIPCIÓN */
    .description-card {
      background: #f8fafc;
      border-radius: 10px;
      padding: 18px 22px;
      border: 1px solid #e2e8f0;
    }

    .description-text {
      font-size: 14.5px;
      line-height: 1.75;
      color: #334155;
      margin: 0;
      white-space: pre-line;
    }

    @media (max-width: 900px) {
      .detail-container {
        padding: 20px 18px 40px;
      }
      .detail-flex {
        flex-direction: column;
      }
      .sidebar-col {
        flex: 1 1 100%;
        max-width: 100%;
      }
      .book-title {
        font-size: 26px;
      }
      .author-card {
        flex: 1 1 100%;
      }
    }
  `]
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  
  book?: Book;
  relatedAuthors: Author[] = [];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadBookDetails(id);
    }
  }

  loadBookDetails(id: number): void {
    forkJoin({
      book: this.bookService.getBook(id),
      authors: this.authorService.getAuthors()
    }).subscribe({
      next: (result: any) => {
        this.book = result.book;
        const allAuthors = Array.isArray(result.authors) ? result.authors : (result.authors.value || []);
        this.relatedAuthors = allAuthors.filter((a: any) => Number(a.idBook || a.IDBook || 0) === Number(id));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading book details:', err)
    });
  }

  openEditDialog(): void {
    if (!this.book) return;

    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '560px',
      data: this.book,
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.bookService.updateBook(this.book!.id, result).subscribe({
          next: () => {
            this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
            this.loadBookDetails(this.book!.id);
          },
          error: (err) => {
            console.error('Error updating book:', err);
            this.snackBar.open('Error updating book', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteBook(): void {
    if (!this.book) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: '¿Eliminar este libro?',
        message: 'Esta acción no se puede deshacer y el registro se eliminará permanentemente del catálogo.',
        itemName: this.book.title,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookService.deleteBook(this.book!.id).subscribe({
          next: () => {
            this.snackBar.open('Libro eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/books']);
          },
          error: (err) => {
            console.error('Error deleting book:', err);
            this.snackBar.open('Error al eliminar el libro', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}
