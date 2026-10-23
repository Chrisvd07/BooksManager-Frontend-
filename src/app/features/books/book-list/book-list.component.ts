import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { BookFormComponent } from '../book-form/book-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="fade-in-up">
      <!-- HERO BANNER -->
      <section class="hero">
        <div class="date-chip">
          <mat-icon>calendar_today</mat-icon>
          <span>{{ today | date:'EEEE, d MMMM' }}</span>
        </div>

        <div class="hero-content">
          <div class="eye">COLECCIÓN GENERAL</div>
          <h1>Catálogo de Libros</h1>
          <p>Consulta y administra el acervo bibliográfico registrado</p>
          <button class="cta" (click)="openBookForm()">
            <mat-icon>add</mat-icon>
            <span>Registrar Nuevo Libro</span>
          </button>
        </div>

        <!-- Ilustración de libros decorativos con paleta azul/slate -->
        <div class="books-ill">
          <div class="plant-ill"></div>
          <div class="bk-item b1"></div>
          <div class="bk-item b2"></div>
          <div class="bk-item b3"></div>
        </div>
      </section>

      <!-- BODY CONTAINER -->
      <div class="body-content">
        <!-- ENCABEZADO DE SECCIÓN + BÚSQUEDA -->
        <div class="sec-header">
          <div>
            <div class="title-with-chip">
              <h2>Mi Colección de Libros</h2>
              <span class="count-chip">{{ books.length }} {{ books.length === 1 ? 'Libro' : 'Libros' }}</span>
            </div>
            <div class="sec-line"></div>
          </div>
          <div class="search-box">
            <mat-icon>search</mat-icon>
            <input 
              type="text" 
              placeholder="Buscar por título o descripción..." 
              (input)="onSearch($event)">
          </div>
        </div>

        <!-- LISTA DE TARJETAS (FLEXBOX SIN GRID) -->
        <div class="book-flex-list">
          @for (book of filteredBooks; track book.id) {
            <article class="book-horizontal-card">
              <!-- Portada del libro (lado izquierdo) -->
              <div class="cv-spine" [ngClass]="getSpineColorClass(book.id)">
                <span class="cv-text">Book<br>#{{ book.id }}</span>
                <mat-icon class="cv-icon">menu_book</mat-icon>
              </div>

              <!-- Información del libro (lado derecho) -->
              <div class="info-content">
                <span class="id-tag">ID #{{ book.id }}</span>
                <h3>{{ book.title }}</h3>
                
                <div class="meta-row">
                  <span class="meta-part">
                    <mat-icon>auto_stories</mat-icon>
                    <span>{{ book.pageCount }} Páginas</span>
                  </span>
                  <i class="meta-sep"></i>
                  <span class="meta-part">
                    <mat-icon>calendar_today</mat-icon>
                    <span>{{ book.publishDate | date:'MMM yyyy' }}</span>
                  </span>
                </div>

                <p class="excerpt-text">{{ book.excerpt || book.description }}</p>
              </div>

              <!-- Pie de la tarjeta -->
              <div class="card-foot">
                <a class="detail-link" [routerLink]="['/books', book.id]">
                  <span>Ver detalles</span>
                  <mat-icon>arrow_forward</mat-icon>
                </a>
                <div class="action-buttons">
                  <button class="ic-btn" (click)="openBookForm(book)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="ic-btn delete-btn" (click)="deleteBook(book.id)" matTooltip="Eliminar">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </div>
            </article>
          }
        </div>

        <!-- Estado vacío si no hay resultados -->
        <p class="empty-state" *ngIf="filteredBooks.length === 0">
          No encontramos libros con esa búsqueda.
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* HERO BANNER CON PALETA AZUL/SLATE */
    .hero { 
      min-height: 230px; 
      position: relative; 
      overflow: hidden; 
      background: linear-gradient(110deg, #eff6ff 0%, #dbeafe 55%, #bfdbfe 100%); 
      padding: 38px 44px 34px 50px; 
      border-bottom: 1px solid #dbeafe;
    }

    .hero:after { 
      content: ""; 
      position: absolute; 
      left: 55%; 
      top: 0; 
      width: 25%; 
      height: 100%; 
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); 
      transform: skewX(-8deg); 
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .date-chip { 
      position: absolute; 
      right: 44px; 
      top: 24px; 
      z-index: 5; 
      display: inline-flex; 
      align-items: center; 
      gap: 8px; 
      font-size: 13px; 
      font-weight: 500;
      color: #2563eb; 
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid rgba(191, 219, 254, 0.7);
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }
    .date-chip mat-icon { font-size: 15px; width: 15px; height: 15px; }

    .eye { 
      font-size: 13px; 
      letter-spacing: .22em; 
      color: #2563eb; 
      font-weight: 700;
    }

    .hero h1 { 
      font: 700 46px/1.1 'Outfit', 'Source Serif 4', sans-serif; 
      margin-top: 8px; 
      color: #0f172a;
      letter-spacing: -1px;
    }

    .hero p { 
      font: 400 17px/1 'Inter', sans-serif; 
      margin-top: 10px; 
      color: #475569;
    }

    .cta { 
      margin-top: 22px; 
      display: inline-flex; 
      align-items: center; 
      gap: 10px; 
      height: 44px; 
      padding: 0 28px 0 22px; 
      border-radius: 22px; 
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
      color: #ffffff; 
      font-size: 14.5px; 
      font-weight: 600; 
      border: 0; 
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
      transition: all 0.2s ease;
    }
    .cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
    }
    .cta mat-icon { font-size: 20px; width: 20px; height: 20px; }

    /* Libros decorativos */
    .books-ill { 
      position: absolute; 
      right: 0; 
      bottom: 0; 
      width: 380px; 
      height: 140px; 
      z-index: 2; 
    }
    .bk-item { 
      position: absolute; 
      border-radius: 6px 14px 3px 3px; 
      height: 46px; 
    }
    .b1 { 
      right: 0; 
      bottom: 0; 
      width: 355px; 
      background: linear-gradient(#f1f5f9, #cbd5e1); 
      box-shadow: 0 8px 14px rgba(15, 23, 42, 0.15); 
    }
    .b2 { 
      right: 0; 
      bottom: 44px; 
      width: 310px; 
      height: 40px; 
      background: #94a3b8; 
    }
    .b3 { 
      right: 20px; 
      bottom: 82px; 
      width: 300px; 
      height: 58px; 
      background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%); 
      box-shadow: 0 6px 12px rgba(15, 23, 42, 0.25); 
      border-radius: 8px 6px 4px 4px; 
    }
    .plant-ill { 
      position: absolute; 
      right: -20px; 
      bottom: 25px; 
      width: 70px; 
      height: 110px; 
      background: #3b82f6; 
      border-radius: 60% 0 60% 0; 
      opacity: 0.35; 
    }

    /* BODY */
    .body-content { 
      padding: 16px 44px 40px; 
    }

    /* SECTION HEADER + BUSCADOR */
    .sec-header { 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      margin-bottom: 28px;
      gap: 20px;
      flex-wrap: wrap;
    }
    .title-with-chip {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .sec-header h2 { 
      font: 700 28px/1 'Outfit', sans-serif; 
      color: #0f172a; 
      margin: 0;
      letter-spacing: -0.5px;
    }
    .count-chip {
      font-size: 12.5px;
      font-weight: 700;
      color: #2563eb;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4px 12px;
      border-radius: 20px;
      letter-spacing: 0.3px;
    }
    .sec-line {
      width: 48px;
      height: 3px;
      background: #2563eb;
      margin-top: 10px;
      border-radius: 2px;
    }

    .search-box {
      flex: 0 1 420px;
      height: 44px;
      border-radius: 22px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 16px;
      color: #64748b;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      transition: all 0.2s ease;
    }
    .search-box:focus-within {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }
    .search-box mat-icon { font-size: 20px; width: 20px; height: 20px; color: #94a3b8; }
    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font: inherit;
      font-size: 14px;
      color: #0f172a;
      background: transparent;
    }
    .search-box input::placeholder { color: #94a3b8; }

    /* LISTA FLEXBOX (SIN GRID COMO PIDIÓ EL USUARIO) */
    .book-flex-list { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 20px; 
    }

    .book-horizontal-card { 
      flex: 0 0 calc((100% - 40px) / 3); 
      min-width: 310px; 
      flex-grow: 1;
      background: #ffffff; 
      border-radius: 14px; 
      padding: 16px 20px 14px 20px; 
      height: 215px; 
      position: relative; 
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06); 
      border: 1px solid #e2e8f0;
      transition: transform .25s ease, box-shadow .25s ease;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    .book-horizontal-card:hover { 
      transform: translateY(-4px); 
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.09); 
      border-color: #bfdbfe;
    }

    @media (max-width: 1280px) {
      .book-horizontal-card {
        flex: 0 0 calc((100% - 20px) / 2);
      }
    }

    @media (max-width: 820px) {
      .book-horizontal-card {
        flex: 1 1 100%;
        min-width: 100%;
      }
    }

    /* Portada de lomo de libro en el lado izquierdo */
    .cv-spine { 
      position: absolute; 
      left: 20px; 
      top: 18px; 
      width: 95px; 
      height: 130px; 
      border-radius: 4px 8px 8px 4px; 
      color: #ffffff; 
      text-align: center; 
      box-shadow: 3px 6px 14px rgba(15, 23, 42, 0.25); 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      font: 700 16px/1.2 'Outfit', sans-serif;
    }
    .cv-spine:before { 
      content: ""; 
      position: absolute; 
      left: 0; 
      top: 0; 
      bottom: 0; 
      width: 6px; 
      background: rgba(0, 0, 0, 0.28); 
      border-radius: 4px 0 0 4px; 
    }
    .cv-icon { 
      margin-top: 14px; 
      font-size: 18px; 
      width: 18px; 
      height: 18px; 
      opacity: 0.6; 
    }

    .cv-blue { background: linear-gradient(145deg, #2563eb 0%, #1e3a8a 100%); }
    .cv-dark { background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%); }
    .cv-indigo { background: linear-gradient(145deg, #4f46e5 0%, #1e1b4b 100%); }

    /* Información a la derecha */
    .info-content { 
      margin-left: 115px; 
      padding-bottom: 40px;
    }
    .id-tag { 
      display: inline-block; 
      font-size: 10.5px; 
      font-weight: 700; 
      background: #eff6ff; 
      color: #2563eb; 
      border-radius: 8px; 
      padding: 3px 9px; 
      border: 1px solid #bfdbfe;
      font-family: monospace;
    }
    .info-content h3 { 
      font: 700 18px/1.2 'Outfit', sans-serif; 
      margin-top: 6px; 
      color: #0f172a;
      letter-spacing: -0.3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .meta-row { 
      display: flex; 
      align-items: center; 
      font-size: 13px; 
      color: #64748b; 
      margin-top: 8px; 
      white-space: nowrap; 
    }
    .meta-part { 
      display: flex; 
      align-items: center; 
      gap: 6px; 
      font-weight: 500;
    }
    .meta-part mat-icon { font-size: 15px; width: 15px; height: 15px; color: #94a3b8; }
    .meta-sep { 
      width: 1px; 
      height: 13px; 
      background: #cbd5e1; 
      margin: 0 12px; 
    }

    .excerpt-text { 
      font-size: 13px; 
      line-height: 1.5; 
      color: #64748b; 
      margin-top: 10px; 
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden; 
    }

    /* Pie de tarjeta con acciones */
    .card-foot { 
      position: absolute; 
      left: 20px; 
      right: 20px; 
      bottom: 12px; 
      display: flex; 
      align-items: center; 
      justify-content: space-between; 
      padding-top: 10px;
      border-top: 1px solid #f1f5f9;
    }
    .detail-link { 
      display: flex; 
      align-items: center; 
      gap: 6px; 
      font-size: 13px; 
      font-weight: 600; 
      color: #2563eb; 
      text-decoration: none; 
      transition: gap 0.2s ease;
    }
    .detail-link:hover { gap: 10px; }
    .detail-link mat-icon { font-size: 15px; width: 15px; height: 15px; }

    .action-buttons { 
      display: flex; 
      gap: 6px; 
    }
    .ic-btn { 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      background: #f1f5f9; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      border: 0; 
      color: #475569; 
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .ic-btn mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .ic-btn:hover { background: #e2e8f0; color: #2563eb; }
    .ic-btn.delete-btn:hover { background: #fee2e2; color: #ef4444; }

    .empty-state { 
      width: 100%; 
      padding: 60px 0; 
      text-align: center; 
      color: #94a3b8; 
      font-size: 16px; 
      font-style: italic; 
    }

    @media (max-width: 900px) {
      .hero { padding: 24px; }
      .books-ill { display: none; }
      .book-horizontal-card { flex: 1 1 100%; max-width: 100%; }
      .body-content { padding: 16px 20px 40px; }
    }
  `]
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  searchTerm: string = '';
  today = new Date();

  get filteredBooks(): Book[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.books;
    return this.books.filter(b => 
      (b.title && b.title.toLowerCase().includes(term)) ||
      (b.description && b.description.toLowerCase().includes(term))
    );
  }

  ngOnInit(): void { 
    this.loadBooks(); 
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: any) => { 
        this.books = Array.isArray(data) ? data : (data.value || []); 
        this.cdr.detectChanges(); 
      },
      error: () => {
        const ref = this.snackBar.open('API connection failed', 'Retry', {
          duration: 6000,
          panelClass: ['premium-snackbar']
        });
        ref.onAction().subscribe(() => this.loadBooks());
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value || '';
  }

  getSpineColorClass(id: number): string {
    const mod = id % 3;
    if (mod === 0) return 'cv-blue';
    if (mod === 1) return 'cv-dark';
    return 'cv-indigo';
  }

  openBookForm(book?: Book): void {
    const dialogRef = this.dialog.open(BookFormComponent, { width: '500px', data: book, panelClass: 'premium-dialog' });
    dialogRef.afterClosed().subscribe(res => { 
      if (res) { 
        this.snackBar.open('Biblioteca actualizada', 'OK', { duration: 3000, panelClass: ['premium-snackbar-success'] }); 
        this.loadBooks(); 
      }
    });
  }

  deleteBook(id: number): void {
    const bookToDelete = this.books.find(b => b.id === id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: '¿Eliminar este libro?',
        message: 'Esta acción no se puede deshacer y el registro se eliminará permanentemente del catálogo.',
        itemName: bookToDelete ? bookToDelete.title : `Libro #${id}`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.bookService.deleteBook(id).subscribe({
          next: () => { 
            this.snackBar.open('Registro eliminado exitosamente', 'OK', { duration: 3000, panelClass: ['premium-snackbar-success'] }); 
            this.loadBooks(); 
          },
          error: () => {
            this.snackBar.open('Fallo al eliminar', 'Cerrar', { duration: 3000, panelClass: ['premium-snackbar'] });
          }
        });
      }
    });
  }
}
