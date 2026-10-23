import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="breadcrumb">
        <a routerLink="/books" class="breadcrumb-link">
          <mat-icon>arrow_back</mat-icon>
          <span>Volver a la Biblioteca</span>
        </a>
      </div>

      <div class="form-card-container">
        <div class="card-header">
          <div class="header-icon-box">
            <mat-icon>{{ isEditMode ? 'edit_note' : 'auto_stories' }}</mat-icon>
          </div>
          <div>
            <h1 class="page-title">{{ isEditMode ? 'Editar Libro' : 'Registrar Nuevo Libro' }}</h1>
            <p class="page-subtitle">
              {{ isEditMode ? 'Modifique los campos correspondientes del registro.' : 'Complete los datos requeridos para dar de alta una obra en el catálogo.' }}
            </p>
          </div>
        </div>

        <div class="error-banner" *ngIf="errorMessage">
          <mat-icon>error_outline</mat-icon>
          <span>{{ errorMessage }}</span>
        </div>

        <form [formGroup]="bookForm" (ngSubmit)="onSave()" class="book-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título de la Obra</mat-label>
            <input matInput formControlName="title" placeholder="Ej. Cien Años de Soledad">
            <mat-icon matPrefix class="field-icon">menu_book</mat-icon>
            <mat-error *ngIf="bookForm.get('title')?.hasError('required')">El título es requerido</mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Número de Páginas</mat-label>
              <input matInput type="number" formControlName="pageCount" placeholder="Ej. 350">
              <mat-icon matPrefix class="field-icon">format_list_numbered</mat-icon>
              <mat-error *ngIf="bookForm.get('pageCount')?.hasError('required')">El número de páginas es requerido</mat-error>
              <mat-error *ngIf="bookForm.get('pageCount')?.hasError('min')">Debe tener al menos 1 página</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Fecha de Publicación</mat-label>
              <input matInput type="datetime-local" formControlName="publishDate">
              <mat-icon matPrefix class="field-icon">calendar_today</mat-icon>
              <mat-error *ngIf="bookForm.get('publishDate')?.hasError('required')">La fecha es requerida</mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Extracto / Resumen Corto</mat-label>
            <textarea matInput formControlName="excerpt" rows="3" placeholder="Breve fragmento que capture el interés del lector..."></textarea>
            <mat-icon matPrefix class="field-icon">format_quote</mat-icon>
            <mat-error *ngIf="bookForm.get('excerpt')?.hasError('required')">El extracto es requerido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción Completa / Sinopsis</mat-label>
            <textarea matInput formControlName="description" rows="5" placeholder="Detalles de la trama, contexto histórico o temas clave..."></textarea>
            <mat-icon matPrefix class="field-icon">description</mat-icon>
            <mat-error *ngIf="bookForm.get('description')?.hasError('required')">La descripción es requerida</mat-error>
          </mat-form-field>

          <div class="form-actions">
            <a mat-button routerLink="/books" class="cancel-btn">
              Cancelar
            </a>
            <button mat-raised-button color="primary" type="submit" [disabled]="bookForm.invalid || isSubmitting" class="submit-btn">
              <mat-icon>{{ isSubmitting ? 'hourglass_top' : (isEditMode ? 'save' : 'add_circle') }}</mat-icon>
              <span>{{ isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Libro') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
    }

    .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #6366f1;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: #4f46e5;
    }

    .form-card-container {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(226, 232, 240, 0.8);
      padding: 36px 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 20px;
    }

    .header-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: #eff6ff;
      color: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-icon-box mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #dc2626;
      font-size: 0.9rem;
    }

    .book-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .field-icon {
      color: #94a3b8;
      margin-right: 8px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
      padding-top: 20px;
      border-top: 1px solid #f1f5f9;
    }

    .cancel-btn {
      color: #64748b;
    }

    .submit-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px;
      height: 44px;
      border-radius: 10px;
      font-weight: 600;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .form-card-container {
        padding: 24px 18px;
      }
    }
  `]
})
export class BookFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  bookForm!: FormGroup;
  isEditMode = false;
  bookId: number | null = null;
  isSubmitting = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.bookId = Number(idParam);
      this.loadBook(this.bookId);
    }
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      pageCount: [null, [Validators.required, Validators.min(1)]],
      excerpt: ['', Validators.required],
      publishDate: ['', Validators.required]
    });
  }

  private loadBook(id: number): void {
    this.bookService.getBook(id).subscribe({
      next: (book: Book) => {
        if (book) {
          this.bookForm.patchValue({
            title: book.title,
            description: book.description,
            pageCount: book.pageCount,
            excerpt: book.excerpt,
            publishDate: book.publishDate ? book.publishDate.slice(0, 16) : ''
          });
        }
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudo cargar la información del libro desde el servidor.';
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 4000 });
      }
    });
  }

  onSave(): void {
    if (this.bookForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const formVal = this.bookForm.value;
      const bookData = {
        ...formVal,
        publishDate: new Date(formVal.publishDate).toISOString()
      };

      const request$: Observable<any> = this.isEditMode && this.bookId
        ? this.bookService.updateBook(this.bookId, bookData)
        : this.bookService.createBook(bookData);

      request$.subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open(
            this.isEditMode ? 'Libro actualizado exitosamente' : 'Libro creado exitosamente',
            'OK',
            { duration: 3000 }
          );
          this.router.navigate(['/books']);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.title || err.message || 'Error al guardar el libro en el servidor.';
          this.snackBar.open(this.errorMessage || 'Error del servidor', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }
}
