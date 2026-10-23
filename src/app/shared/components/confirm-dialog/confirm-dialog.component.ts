import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog-container">
      <div class="icon-warning-wrapper">
        <mat-icon>warning_amber</mat-icon>
      </div>

      <h2 class="dialog-title">{{ data.title || '¿Deseas eliminar este registro?' }}</h2>
      
      <p class="dialog-message">
        {{ data.message || 'Esta acción no se puede deshacer y se eliminará permanentemente.' }}
      </p>

      <div class="item-preview" *ngIf="data.itemName">
        <mat-icon>label_outline</mat-icon>
        <span>{{ data.itemName }}</span>
      </div>

      <div class="dialog-actions">
        <button mat-button class="btn-cancel" (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button mat-raised-button class="btn-confirm-delete" (click)="onConfirm()">
          <mat-icon>delete</mat-icon>
          <span>{{ data.confirmText || 'Sí, eliminar' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog-container {
      padding: 24px 20px 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: 'Inter', sans-serif;
    }

    .icon-warning-wrapper {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #fee2e2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      box-shadow: 0 0 0 6px #fef2f2;
    }
    .icon-warning-wrapper mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
    }

    .dialog-title {
      font: 700 19px/1.2 'Outfit', sans-serif;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .dialog-message {
      font-size: 13.5px;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 14px 0;
      max-width: 320px;
    }

    .item-preview {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 20px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-preview mat-icon {
      font-size: 15px;
      width: 15px;
      height: 15px;
      color: #2563eb;
    }

    .dialog-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
    }

    .btn-cancel {
      border-radius: 8px !important;
      padding: 0 18px !important;
      height: 38px !important;
      font-weight: 600 !important;
      color: #64748b !important;
      border: 1px solid #e2e8f0 !important;
    }
    .btn-cancel:hover {
      background: #f1f5f9 !important;
      color: #0f172a !important;
    }

    .btn-confirm-delete {
      background: #ef4444 !important;
      color: #ffffff !important;
      border-radius: 8px !important;
      padding: 0 18px !important;
      height: 38px !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25) !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
    }
    .btn-confirm-delete:hover {
      background: #dc2626 !important;
    }
    .btn-confirm-delete mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
