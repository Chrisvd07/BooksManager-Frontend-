import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="navbar glass-card">
      <div class="container">
        <span class="logo" routerLink="/">
          <mat-icon>auto_stories</mat-icon>
          Book<span>Manager</span>
        </span>
        <div class="nav-links">
          <button mat-button routerLink="/books" routerLinkActive="active-link">Books</button>
          <button mat-button routerLink="/authors" routerLinkActive="active-link">Authors</button>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: rgba(15, 23, 42, 0.8) !important;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 70px;
      margin-bottom: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      letter-spacing: -0.5px;
    }
    .logo span {
      color: var(--primary-color);
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    .active-link {
      background: rgba(99, 102, 241, 0.15) !important;
      color: var(--primary-color) !important;
    }
    button {
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  `]
})
export class NavbarComponent {}
