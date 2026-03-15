import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar glass-nav">
      <div class="nav-brand" routerLink="/">
        <div class="logo-icon"></div>
        <span>ElevateHire</span>
      </div>
      
      <div class="nav-links">
        <ng-container *ngIf="(role$ | async) === null">
          <a routerLink="/login" class="nav-link">Login</a>
          <a routerLink="/register" class="btn-primary">Get Started</a>
        </ng-container>

        <ng-container *ngIf="(role$ | async) as role">
          <a *ngIf="role === 'ORG'" routerLink="/org/dashboard" class="nav-link">Dashboard</a>
          <a *ngIf="role === 'INTERVIEWER'" routerLink="/interviewer/dashboard" class="nav-link">Dashboard</a>
          <a *ngIf="role === 'CANDIDATE'" routerLink="/candidate/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/profile" class="nav-link">Profile</a>
          <button (click)="logout()" class="btn-outline">Logout</button>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 32px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .glass-nav {
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 700;
      color: white;
      text-decoration: none;
      cursor: pointer;
    }
    .logo-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
      transition: color 0.2s;
    }
    .nav-link:hover, .nav-link.active {
      color: white;
    }
  `]
})
export class NavbarComponent {
  role$: Observable<string | null>;

  constructor(private authService: AuthService) {
    this.role$ = this.authService.getCurrentRoleStatus();
  }

  logout() {
    this.authService.logout();
  }
}
