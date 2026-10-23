import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="app-shell">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <!-- Logo -->
        <div class="logo">
          <div class="logo-icon">
            <mat-icon>auto_stories</mat-icon>
          </div>
          <div>
            <b>Biblos</b>
            <small>FONDO EDITORIAL</small>
          </div>
        </div>

        <!-- Navigation -->
        <nav>
          <a routerLink="/books" routerLinkActive="on" class="nav-item">
            <mat-icon>menu_book</mat-icon>
            <span>Catálogo de Libros</span>
          </a>
          <a routerLink="/authors" routerLinkActive="on" class="nav-item">
            <mat-icon>people_outline</mat-icon>
            <span>Directorio de Autores</span>
          </a>
          <div class="status-indicator">
            <span class="dot"></span>
            <span>Repositorio Activo</span>
          </div>
        </nav>

        <!-- Quote -->
        <div class="quote">
          Los libros no solo<br>se leen, se viven.
        </div>

        <!-- Artistic accent shape -->
        <div class="leaf-shape"></div>
      </aside>

      <!-- MAIN WRAPPER -->
      <div class="main-wrapper">
        <!-- Top Header -->
        <header class="top-header">
          <div class="breadcrumb">
            <span class="bc-parent">Biblos</span>
            <mat-icon>chevron_right</mat-icon>
            <span class="bc-current">Gestión Bibliotecaria</span>
          </div>
        </header>

        <!-- Page View Outlet -->
        <main class="page-container">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell { 
      display: flex; 
      min-height: 100vh; 
      width: 100%;
      background: #f8fafc; 
      font-family: 'Inter', sans-serif;
    }

    /* Sidebar con paleta azul oscuro/slate del proyecto */
    .sidebar { 
      width: 285px; 
      flex: 0 0 285px;
      height: 100vh;
      position: sticky;
      top: 0;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); 
      color: #ffffff; 
      display: flex; 
      flex-direction: column; 
      overflow: hidden;
      box-shadow: 4px 0 24px rgba(15, 23, 42, 0.08);
      z-index: 20;
    }

    .logo { 
      display: flex; 
      align-items: center; 
      gap: 14px; 
      padding: 30px 28px 0; 
    }

    .logo-icon {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
    }

    .logo-icon mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .logo b { 
      font: 700 28px/1 'Outfit', sans-serif; 
      display: block; 
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .logo small { 
      display: block; 
      font-size: 11px; 
      letter-spacing: .25em; 
      color: #94a3b8; 
      margin-top: 4px; 
      font-weight: 600;
    }

    nav { 
      margin: 36px 16px 0; 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
    }

    .nav-item { 
      display: flex; 
      align-items: center; 
      gap: 14px; 
      padding: 0 18px; 
      height: 48px; 
      border-radius: 12px; 
      font-size: 14.5px; 
      color: #cbd5e1; 
      text-decoration: none; 
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .nav-item mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: #94a3b8;
      transition: color 0.2s ease;
    }

    .nav-item:hover { 
      background: rgba(255, 255, 255, 0.08); 
      color: #ffffff;
    }

    .nav-item.on { 
      background: #2563eb; 
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
    }

    .nav-item.on mat-icon {
      color: #ffffff;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 18px;
      height: 40px;
      margin-top: 10px;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 10px;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .quote { 
      margin-top: auto; 
      padding: 0 28px 36px; 
      font: italic 14.5px/1.45 'Source Serif 4', Georgia, serif; 
      color: #94a3b8; 
      position: relative;
      z-index: 2;
    }

    .quote:before { 
      content: ""; 
      display: block; 
      width: 30px; 
      height: 2px; 
      background: #3b82f6; 
      margin-bottom: 14px; 
    }

    .leaf-shape { 
      position: absolute; 
      left: -30px; 
      bottom: -40px; 
      width: 220px; 
      height: 220px; 
      border-radius: 60% 0 60% 0;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.02) 100%);
      pointer-events: none;
    }

    /* Main Wrapper */
    .main-wrapper {
      flex: 1 1 0%;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    /* Top Header */
    .top-header { 
      height: 68px; 
      background: #ffffff; 
      display: flex; 
      align-items: center; 
      padding: 0 36px; 
      border-bottom: 1px solid #e2e8f0; 
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .breadcrumb { 
      display: flex; 
      align-items: center; 
      gap: 6px; 
      color: #94a3b8; 
      font-size: 14px; 
      font-weight: 500; 
    }

    .bc-parent { 
      color: #64748b; 
    }

    .bc-current { 
      color: #0f172a; 
      font-weight: 700; 
    }

    .breadcrumb mat-icon { 
      font-size: 18px; 
      width: 18px; 
      height: 18px; 
    }

    .page-container { 
      flex: 1;
      padding: 0;
    }

    @media (max-width: 900px) {
      .sidebar { display: none; }
      .top-header { padding: 0 20px; }
    }
  `]
})
export class MainLayoutComponent {}
