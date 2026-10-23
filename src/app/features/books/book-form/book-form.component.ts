import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add New' }} Book</h2>
    <mat-dialog-content>
      <div class="error-banner" *ngIf="errorMessage">
        <mat-icon>error_outline</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>

      <form [formGroup]="bookForm" class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Enter book title">
          <mat-error *ngIf="bookForm.get('title')?.hasError('required')">El título es requerido</mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Page Count</mat-label>
            <input matInput type="number" formControlName="pageCount" placeholder="0">
            <mat-error *ngIf="bookForm.get('pageCount')?.invalid">Páginas válidas requeridas</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Publish Date</mat-label>
            <input matInput type="datetime-local" formControlName="publishDate">
            <mat-error *ngIf="bookForm.get('publishDate')?.invalid">Fecha requerida</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Excerpt</mat-label>
          <input matInput formControlName="excerpt" placeholder="Short summary...">
          <mat-error *ngIf="bookForm.get('excerpt')?.invalid">El extracto es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Full description..."></textarea>
          <mat-error *ngIf="bookForm.get('description')?.invalid">La descripción es requerida</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="isSubmitting">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="bookForm.invalid || isSubmitting" (click)="onSave()">
        {{ isSubmitting ? 'Guardando...' : (data ? 'Update' : 'Save') }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.5rem; }
    .form-row { display: flex; gap: 1rem; }
    mat-form-field { width: 100%; }
    h2 { color: #0f172a !important; font-weight: 700; font-family: 'Outfit', sans-serif; margin-bottom: 0 !important; }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      margin-top: 10px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      color: #b91c1c;
      font-size: 13px;
      font-weight: 500;
    }
    .error-banner mat-icon { font-size: 18px; width: 18px; height: 18px; color: #ef4444; }
  `]
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private snackBar = inject(MatSnackBar);
  
  bookForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      pageCount: [0, [Validators.required, Validators.min(0)]],
      excerpt: ['', Validators.required],
      publishDate: [new Date().toISOString().slice(0, 16), Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.bookForm.patchValue({
        ...this.data,
        publishDate: this.data.publishDate ? this.data.publishDate.slice(0, 16) : ''
      });
    }
  }

  onSave(): void {
    if (this.bookForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const bookData = {
        ...this.bookForm.value,
        publishDate: new Date(this.bookForm.value.publishDate).toISOString()
      };
      
      const request$: Observable<any> = this.data
        ? this.bookService.updateBook(this.data.id, bookData)
        : this.bookService.createBook(bookData);

      request$.subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.title || err.message || 'Error al guardar el libro en el servidor.';
          this.snackBar.open(this.errorMessage || 'Error del servidor', 'Cerrar', {
            duration: 5000,
            panelClass: ['premium-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
