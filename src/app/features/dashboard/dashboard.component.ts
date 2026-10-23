import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-header">
      <h1>Library Analytics</h1>
      <p>Real-time overview of your library system performance.</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card glass-card">
        <div class="icon-box books"><mat-icon>menu_book</mat-icon></div>
        <div class="content">
          <span class="label">Total Books</span>
          <span class="value">{{ totalBooks }}</span>
        </div>
      </div>

      <div class="stat-card glass-card">
        <div class="icon-box authors"><mat-icon>people</mat-icon></div>
        <div class="content">
          <span class="label">Total Authors</span>
          <span class="value">{{ totalAuthors }}</span>
        </div>
      </div>

      <div class="stat-card glass-card">
        <div class="icon-box trending"><mat-icon>trending_up</mat-icon></div>
        <div class="content">
          <span class="label">Monthly Growth</span>
          <span class="value">+12%</span>
        </div>
      </div>
    </div>

    <div class="dashboard-footer glass-card">
      <mat-icon>info</mat-icon>
      <span>Connected to .NET API at <strong>localhost:7278</strong></span>
    </div>
  `,
  styles: [`
    .dashboard-header { margin-bottom: 3.5rem; }
    h1 { font-size: 2.8rem; font-weight: 800; color: white; margin-bottom: 0.5rem; letter-spacing: -1.5px; }
    p { color: #94a3b8; font-size: 1.15rem; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .icon-box {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-box mat-icon { font-size: 2.2rem; width: 2.2rem; height: 2.2rem; }
    
    .books { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .authors { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
    .trending { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .content { display: flex; flex-direction: column; }
    .label { font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; margin-bottom: 0.25rem; }
    .value { font-size: 2.5rem; font-weight: 800; color: white; line-height: 1; }

    .dashboard-footer {
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #94a3b8;
      font-size: 0.95rem;
    }
    .dashboard-footer mat-icon { color: #6366f1; }
    strong { color: white; }
  `]
})
export class DashboardComponent implements OnInit {
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private cdr = inject(ChangeDetectorRef);

  totalBooks = 0;
  totalAuthors = 0;

  ngOnInit() {
    console.log('Dashboard initialized, fetching stats...');
    
    this.bookService.getBooks().subscribe({
      next: (data: any) => {
        const books = Array.isArray(data) ? data : (data.value || []);
        this.totalBooks = books.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Dashboard Book Error:', err)
    });

    this.authorService.getAuthors().subscribe({
      next: (data: any) => {
        const authors = Array.isArray(data) ? data : (data.value || []);
        // Contar autores únicos por nombre completo
        const uniqueNames = new Set(authors.map((a: any) => `${a.firstName} ${a.lastName}`));
        this.totalAuthors = uniqueNames.size;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Dashboard Author Error:', err)
    });
  }
}
