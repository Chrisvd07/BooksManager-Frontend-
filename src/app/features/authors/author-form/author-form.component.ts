import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthorService } from '../../../core/services/author.service';
import { Author } from '../../../core/models/book.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-author-form',
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
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add New' }} Author</h2>
    <mat-dialog-content>
      <div class="error-banner" *ngIf="errorMessage">
        <mat-icon>error_outline</mat-icon>
        <span>{{ errorMessage }}</span>
      </div>

      <form [formGroup]="authorForm" class="form-container">
        <mat-form-field appearance="outline">
          <mat-label>ID Book</mat-label>
          <input matInput type="number" formControlName="idBook" placeholder="Enter book ID">
          <mat-error *ngIf="authorForm.get('idBook')?.hasError('required')">El ID del libro es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" placeholder="Enter first name">
          <mat-error *ngIf="authorForm.get('firstName')?.hasError('required')">El nombre es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" placeholder="Enter last name">
          <mat-error *ngIf="authorForm.get('lastName')?.hasError('required')">El apellido es requerido</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="isSubmitting">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="authorForm.invalid || isSubmitting" (click)="onSave()">
        {{ isSubmitting ? 'Guardando...' : (data ? 'Update' : 'Save') }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 0.5rem; }
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
export class AuthorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  private snackBar = inject(MatSnackBar);
  
  authorForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AuthorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Author
  ) {
    this.authorForm = this.fb.group({
      idBook: [0, [Validators.required, Validators.min(0)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.authorForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.authorForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const authorData = this.authorForm.value;
      const request$: Observable<any> = this.data
        ? this.authorService.updateAuthor(this.data.id, authorData)
        : this.authorService.createAuthor(authorData);

      request$.subscribe({
        next: () => {
          this.isSubmitting = false;
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.title || err.message || 'Error al guardar el autor en el servidor.';
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
