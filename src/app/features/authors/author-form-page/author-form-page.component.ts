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
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/book.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-author-form-page',
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
        <a routerLink="/authors" class="breadcrumb-link">
          <mat-icon>arrow_back</mat-icon>
          <span>Volver al Directorio de Autores</span>
        </a>
      </div>

      <div class="form-card-container">
        <div class="card-header">
          <div class="header-icon-box">
            <mat-icon>{{ isEditMode ? 'manage_accounts' : 'person_add' }}</mat-icon>
          </div>
          <div>
            <h1 class="page-title">{{ isEditMode ? 'Editar Autor' : 'Registrar Nuevo Autor' }}</h1>
            <p class="page-subtitle">
              {{ isEditMode ? 'Actualice la información del autor y su vinculación literaria.' : 'Ingrese los datos personales y el ID del libro correspondiente.' }}
            </p>
          </div>
        </div>

        <div class="error-banner" *ngIf="errorMessage">
          <mat-icon>error_outline</mat-icon>
          <span>{{ errorMessage }}</span>
        </div>

        <form [formGroup]="authorForm" (ngSubmit)="onSave()" class="author-form">
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="firstName" placeholder="Ej. Gabriel">
              <mat-icon matPrefix class="field-icon">badge</mat-icon>
              <mat-error *ngIf="authorForm.get('firstName')?.hasError('required')">El nombre es requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="lastName" placeholder="Ej. García Márquez">
              <mat-icon matPrefix class="field-icon">person</mat-icon>
              <mat-error *ngIf="authorForm.get('lastName')?.hasError('required')">El apellido es requerido</mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ID del Libro Asociado (idBook)</mat-label>
            <input matInput type="number" formControlName="idBook" placeholder="Ej. 1">
            <mat-icon matPrefix class="field-icon">auto_stories</mat-icon>
            <mat-hint>Identificador de la obra literaria vinculada a este autor en el catálogo</mat-hint>
            <mat-error *ngIf="authorForm.get('idBook')?.hasError('required')">El ID del libro es requerido</mat-error>
            <mat-error *ngIf="authorForm.get('idBook')?.hasError('min')">Debe ser un ID válido mayor a 0</mat-error>
          </mat-form-field>

          <div class="form-actions">
            <a mat-button routerLink="/authors" class="cancel-btn">
              Cancelar
            </a>
            <button mat-raised-button color="primary" type="submit" [disabled]="authorForm.invalid || isSubmitting" class="submit-btn">
              <mat-icon>{{ isSubmitting ? 'hourglass_top' : (isEditMode ? 'save' : 'person_add') }}</mat-icon>
              <span>{{ isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Autor') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 700px;
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

    .author-form {
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
export class AuthorFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  authorForm!: FormGroup;
  isEditMode = false;
  authorId: number | null = null;
  isSubmitting = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.authorId = Number(idParam);
      this.loadAuthor(this.authorId);
    }
  }

  private initForm(): void {
    this.authorForm = this.fb.group({
      idBook: [null, [Validators.required, Validators.min(1)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  private loadAuthor(id: number): void {
    this.authorService.getAuthor(id).subscribe({
      next: (author: Author) => {
        if (author) {
          this.authorForm.patchValue({
            idBook: author.idBook,
            firstName: author.firstName,
            lastName: author.lastName
          });
        }
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudo cargar la información del autor desde el servidor.';
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 4000 });
      }
    });
  }

  onSave(): void {
    if (this.authorForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const authorData = this.authorForm.value;

      const request$: Observable<any> = this.isEditMode && this.authorId
        ? this.authorService.updateAuthor(this.authorId, authorData)
        : this.authorService.createAuthor(authorData);

      request$.subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open(
            this.isEditMode ? 'Autor actualizado exitosamente' : 'Autor registrado exitosamente',
            'OK',
            { duration: 3000 }
          );
          this.router.navigate(['/authors']);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.title || err.message || 'Error al guardar el autor en el servidor.';
          this.snackBar.open(this.errorMessage || 'Error del servidor', 'Cerrar', {
            duration: 5000
          });
        }
      });
    }
  }
}
