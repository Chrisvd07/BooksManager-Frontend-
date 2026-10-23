import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/book.model';
import { AuthorFormComponent } from '../author-form/author-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule, 
    MatSnackBarModule, 
    MatTooltipModule
  ],
  template: `
    <div class="fade-in-up">
      <!-- HERO BANNER (MISMA LÍNEA QUE EL CATÁLOGO DE LIBROS) -->
      <section class="hero">
        <div class="date-chip">
          <mat-icon>calendar_today</mat-icon>
          <span>{{ today | date:'EEEE, d MMMM' }}</span>
        </div>

        <div class="hero-content">
          <div class="eye">DIRECTORIO DE ESCRITORES</div>
          <h1>Autores y Creadores</h1>
          <p>Consulta los autores registrados y sus obras vinculadas</p>
          <button class="cta" (click)="openAuthorForm()">
            <mat-icon>person_add</mat-icon>
            <span>Registrar Nuevo Autor</span>
          </button>
        </div>

        <!-- Ilustración decorativa con paleta azul/slate -->
        <div class="authors-ill">
          <div class="circle-ill c1"></div>
          <div class="circle-ill c2"></div>
          <div class="card-ill k1">
            <mat-icon>people</mat-icon>
          </div>
          <div class="card-ill k2">
            <mat-icon>school</mat-icon>
          </div>
        </div>
      </section>

      <!-- BODY CONTAINER -->
      <div class="body-content">
        <!-- ENCABEZADO DE SECCIÓN + BUSCADOR -->
        <div class="sec-header">
          <div>
            <div class="title-with-chip">
              <h2>Colección de Autores</h2>
              <span class="count-chip">{{ authors.length }} {{ authors.length === 1 ? 'Autor' : 'Autores' }}</span>
            </div>
            <div class="sec-line"></div>
          </div>
          
          <div class="search-box">
            <mat-icon>search</mat-icon>
            <input 
              type="text" 
              placeholder="Buscar por nombre o apellido..." 
              (input)="onSearch($event)">
          </div>
        </div>

        <!-- LISTA DE AUTORES (FLEXBOX SIN GRID) -->
        <div class="authors-flex-list">
          @for (author of filteredAuthors; track author.id) {
            <article class="author-card">
              <!-- Avatar / Insignia Lateral -->
              <div class="author-avatar-badge" [ngClass]="getAvatarColorClass(author.id)">
                <span class="avatar-initial">{{ (author.firstName ? author.firstName[0] : 'A') | uppercase }}</span>
                <mat-icon class="avatar-icon">person</mat-icon>
              </div>

              <!-- Información del Autor (Solo datos reales) -->
              <div class="author-info">
                <span class="ref-tag">REF #{{ author.id }}</span>
                <h3 class="author-name">{{ author.firstName }} {{ author.lastName }}</h3>

                <div class="meta-row">
                  <span class="meta-part">
                    <mat-icon>menu_book</mat-icon>
                    <span>ID Libro: #{{ author.idBook }}</span>
                  </span>
                  <i class="meta-sep"></i>
                  <span class="meta-part">
                    <mat-icon>bookmark_border</mat-icon>
                    <span>{{ author.booksCount ?? 0 }} {{ (author.booksCount ?? 0) === 1 ? 'Libro publicado' : 'Libros publicados' }}</span>
                  </span>
                </div>
              </div>

              <!-- Pie de la Tarjeta con Acciones -->
              <div class="card-foot">
                <span class="status-pill">
                  <span class="dot"></span>
                  Autor Registrado
                </span>

                <div class="action-buttons">
                  <button class="ic-btn" (click)="openAuthorForm(author)" matTooltip="Editar autor">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="ic-btn delete-btn" (click)="deleteAuthor(author.id)" matTooltip="Eliminar autor">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </div>
            </article>
          }
        </div>

        <!-- Estado vacío si la búsqueda no arroja resultados -->
        <p class="empty-state" *ngIf="filteredAuthors.length === 0">
          No encontramos autores que coincidan con la búsqueda.
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* HERO BANNER */
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
      font: 700 46px/1.1 'Outfit', sans-serif; 
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

    /* BODY CONTAINER */
    .body-content { 
      padding: 16px 44px 40px; 
    }



    /* Ilustración decorativa para autores */
    .authors-ill { 
      position: absolute; 
      right: 40px; 
      bottom: 10px; 
      width: 280px; 
      height: 160px; 
      z-index: 2; 
      pointer-events: none;
    }
    .circle-ill {
      position: absolute;
      border-radius: 50%;
    }
    .c1 {
      right: 30px;
      bottom: 20px;
      width: 120px;
      height: 120px;
      background: rgba(37, 99, 235, 0.12);
    }
    .c2 {
      right: 120px;
      bottom: 50px;
      width: 70px;
      height: 70px;
      background: rgba(147, 197, 253, 0.25);
    }
    .card-ill {
      position: absolute;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
    }
    .k1 {
      right: 40px;
      bottom: 25px;
      width: 90px;
      height: 90px;
      background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
      color: #ffffff;
      transform: rotate(-6deg);
    }
    .k1 mat-icon { font-size: 44px; width: 44px; height: 44px; }
    .k2 {
      right: 110px;
      bottom: 15px;
      width: 70px;
      height: 70px;
      background: #ffffff;
      color: #2563eb;
      transform: rotate(8deg);
      border: 1px solid #bfdbfe;
    }
    .k2 mat-icon { font-size: 32px; width: 32px; height: 32px; }

    /* ENCABEZADO Y BUSCADOR */
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

    /* LISTA FLEXBOX DE AUTORES (SIN CSS GRID) */
    .authors-flex-list { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 20px; 
    }

    .author-card { 
      flex: 0 0 calc((100% - 40px) / 3); 
      min-width: 310px; 
      flex-grow: 1;
      background: #ffffff; 
      border-radius: 14px; 
      padding: 16px 20px 14px 20px; 
      height: 185px; 
      position: relative; 
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06); 
      border: 1px solid #e2e8f0;
      transition: transform .25s ease, box-shadow .25s ease;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    .author-card:hover { 
      transform: translateY(-4px); 
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.09); 
      border-color: #bfdbfe;
    }

    @media (max-width: 1280px) {
      .author-card {
        flex: 0 0 calc((100% - 20px) / 2);
      }
    }

    @media (max-width: 820px) {
      .author-card {
        flex: 1 1 100%;
        min-width: 100%;
      }
    }

    /* Avatar lateral */
    .author-avatar-badge { 
      position: absolute; 
      left: 20px; 
      top: 18px; 
      width: 78px; 
      height: 100px; 
      border-radius: 12px; 
      color: #ffffff; 
      text-align: center; 
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.18); 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      font: 700 24px/1 'Outfit', sans-serif;
    }
    .avatar-icon { 
      margin-top: 8px; 
      font-size: 16px; 
      width: 16px; 
      height: 16px; 
      opacity: 0.7; 
    }

    .av-blue { background: linear-gradient(145deg, #2563eb 0%, #1e3a8a 100%); }
    .av-dark { background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%); }
    .av-indigo { background: linear-gradient(145deg, #4f46e5 0%, #1e1b4b 100%); }

    /* Información del Autor */
    .author-info { 
      margin-left: 96px; 
      padding-bottom: 30px;
    }
    .ref-tag { 
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
    .author-name { 
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
      font-size: 12.5px; 
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
      margin: 0 10px; 
    }

    /* Pie de Tarjeta */
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

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

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
      .authors-ill { display: none; }
      .body-content { padding: 16px 20px 40px; }
    }
  `]
})
export class AuthorListComponent implements OnInit {
  private authorService = inject(AuthorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  authors: Author[] = [];
  searchTerm: string = '';
  today = new Date();

  get filteredAuthors(): Author[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.authors;
    return this.authors.filter(a => 
      (a.firstName && a.firstName.toLowerCase().includes(term)) ||
      (a.lastName && a.lastName.toLowerCase().includes(term))
    );
  }

  ngOnInit(): void { 
    this.loadAuthors(); 
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (data: any) => {
        const raw = Array.isArray(data) ? data : (data.value || []);
        
        // Contar obras distintas reales por autor mediante idBook
        const bookCountByName = new Map<string, Set<number>>();
        raw.forEach((item: any) => {
          const nameKey = `${(item.firstName || '').trim().toLowerCase()} ${(item.lastName || '').trim().toLowerCase()}`;
          if (!bookCountByName.has(nameKey)) {
            bookCountByName.set(nameKey, new Set<number>());
          }
          if (item.idBook && item.idBook > 0) {
            bookCountByName.get(nameKey)!.add(item.idBook);
          }
        });

        // Agrupar autor único con su conteo exacto de libros publicados
        const authorMap = new Map<string, Author>();
        raw.forEach((item: any) => {
          const nameKey = `${(item.firstName || '').trim().toLowerCase()} ${(item.lastName || '').trim().toLowerCase()}`;
          if (!authorMap.has(nameKey)) {
            const count = bookCountByName.get(nameKey)?.size ?? 0;
            authorMap.set(nameKey, { ...item, booksCount: count });
          }
        });

        this.authors = Array.from(authorMap.values());
        this.cdr.detectChanges();
      },
      error: () => {
        const ref = this.snackBar.open('API connection failed', 'Retry', {
          duration: 6000,
          panelClass: ['premium-snackbar']
        });
        ref.onAction().subscribe(() => this.loadAuthors());
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value || '';
  }

  getAvatarColorClass(id: number): string {
    const mod = id % 3;
    if (mod === 0) return 'av-blue';
    if (mod === 1) return 'av-dark';
    return 'av-indigo';
  }

  openAuthorForm(author?: Author): void {
    const dialogRef = this.dialog.open(AuthorFormComponent, { 
      width: '440px', 
      data: author, 
      panelClass: 'custom-dialog' 
    });

    dialogRef.afterClosed().subscribe(res => { 
      if (res) { 
        this.snackBar.open('Directorio de autores actualizado', 'OK', { 
          duration: 3000,
          panelClass: ['premium-snackbar-success']
        }); 
        this.loadAuthors(); 
      }
    });
  }

  deleteAuthor(id: number): void {
    const authorToDelete = this.authors.find(a => a.id === id);
    const authorName = authorToDelete ? `${authorToDelete.firstName} ${authorToDelete.lastName}` : `Autor #${id}`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: '¿Eliminar este autor?',
        message: 'Esta acción no se puede deshacer y se eliminará el registro del directorio.',
        itemName: authorName,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.authorService.deleteAuthor(id).subscribe({
          next: () => { 
            this.snackBar.open('Registro eliminado exitosamente', 'OK', { 
              duration: 3000,
              panelClass: ['premium-snackbar-success']
            }); 
            this.loadAuthors(); 
          },
          error: () => this.snackBar.open('Fallo al eliminar autor', 'Cerrar', {
            duration: 3000,
            panelClass: ['premium-snackbar']
          })
        });
      }
    });
  }
}
