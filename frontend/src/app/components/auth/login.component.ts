import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container animate-in">
      <div class="glass-card auth-card">
        <div class="text-center mb-6">
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Login to ElevateHire</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" class="form-control" formControlName="email" placeholder="name@example.com">
            <span class="form-error" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']">Email is required</span>
            <span class="form-error" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']">Enter a valid email</span>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="••••••••">
            <span class="form-error" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">Password is required</span>
          </div>

          <div class="form-error text-center mb-4" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" class="btn-primary w-100" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading">Verifying...</span>
          </button>
        </form>
        
        <p class="auth-footer text-center mt-6">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 150px);
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
    }
    .auth-title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #fff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .auth-subtitle {
      color: var(--text-muted);
      font-size: 15px;
    }
    .mb-6 { margin-bottom: 24px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-6 { margin-top: 24px; }
    .text-center { text-align: center; }
    .w-100 { width: 100%; }
    .auth-footer {
      color: var(--text-muted);
      font-size: 14px;
    }
    .auth-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.role === 'ORG') this.router.navigate(['/org/dashboard']);
          else if (res.role === 'INTERVIEWER') this.router.navigate(['/interviewer/dashboard']);
          else this.router.navigate(['/candidate/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Invalid credentials. Please try again.';
        }
      });
    }
  }
}
