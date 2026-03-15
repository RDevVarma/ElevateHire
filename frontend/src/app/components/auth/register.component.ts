import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container animate-in">
      <div class="glass-card register-card">
        <div class="text-center mb-6">
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join ElevateHire to streamline your hiring</p>
        </div>
        
        <div class="role-selector mb-6">
          <button [class.active]="selectedRole === 'CANDIDATE'" (click)="selectRole('CANDIDATE')">Candidate</button>
          <button [class.active]="selectedRole === 'INTERVIEWER'" (click)="selectRole('INTERVIEWER')">Interviewer</button>
          <button [class.active]="selectedRole === 'ORG'" (click)="selectRole('ORG')">Organization</button>
        </div>
        
        <!-- Candidate Form -->
        <form *ngIf="selectedRole === 'CANDIDATE'" [formGroup]="candidateForm" (ngSubmit)="onSubmit(candidateForm)">
          <!-- Personal Info -->
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" formControlName="name">
              <span class="form-error" *ngIf="hasError(candidateForm, 'name')">Name is required</span>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" class="form-control" formControlName="email">
              <span class="form-error" *ngIf="hasError(candidateForm, 'email')">Valid email required</span>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control" formControlName="password">
              <span class="form-error" *ngIf="hasError(candidateForm, 'password')">At least 8 chars, 1 uppercase, 1 lowercase, 1 number</span>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" class="form-control" formControlName="phone">
              <span class="form-error" *ngIf="hasError(candidateForm, 'phone')">Must be exactly 10 digits</span>
            </div>
            <div class="form-group">
              <label>Aadhaar Number</label>
              <input type="text" class="form-control" formControlName="aadhaar">
              <span class="form-error" *ngIf="hasError(candidateForm, 'aadhaar')">Must be exactly 12 digits</span>
            </div>
            <div class="form-group">
              <label>Date of Birth</label>
              <input type="date" class="form-control" formControlName="dob">
              <span class="form-error" *ngIf="hasError(candidateForm, 'dob')">DOB is required</span>
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select class="form-control" formControlName="gender">
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <span class="form-error" *ngIf="hasError(candidateForm, 'gender')">Gender is required</span>
            </div>
            <div class="form-group">
              <label>Highest Qualification</label>
              <input type="text" class="form-control" formControlName="highestQualification">
              <span class="form-error" *ngIf="hasError(candidateForm, 'highestQualification')">Required</span>
            </div>
          </div>
          <div class="form-group">
            <label>Tech Stack (comma separated)</label>
            <input type="text" class="form-control" formControlName="skills">
            <span class="form-error" *ngIf="hasError(candidateForm, 'skills')">Tech Stack is required</span>
          </div>
          <div class="form-group">
            <label>Years of Experience</label>
            <input type="number" class="form-control" formControlName="experience">
          </div>

          <div class="form-error text-center mb-4" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary w-100" [disabled]="isLoading">Register</button>
        </form>

        <!-- Interviewer Form -->
        <form *ngIf="selectedRole === 'INTERVIEWER'" [formGroup]="interviewerForm" (ngSubmit)="onSubmit(interviewerForm)">
          <div class="form-grid">
            <div class="form-group"><label>Name</label><input type="text" class="form-control" formControlName="name"></div>
            <div class="form-group"><label>Email</label><input type="email" class="form-control" formControlName="email"></div>
            <div class="form-group">
              <label>Password</label><input type="password" class="form-control" formControlName="password">
              <span class="form-error" *ngIf="hasError(interviewerForm, 'password')">At least 8 chars, 1 uppercase, 1 lowercase, 1 number</span>
            </div>
            <div class="form-group">
              <label>Phone</label><input type="text" class="form-control" formControlName="phone">
              <span class="form-error" *ngIf="hasError(interviewerForm, 'phone')">Must be exactly 10 digits</span>
            </div>
            <div class="form-group">
              <label>Aadhaar</label><input type="text" class="form-control" formControlName="aadhaar">
              <span class="form-error" *ngIf="hasError(interviewerForm, 'aadhaar')">Must be exactly 12 digits</span>
            </div>
            <div class="form-group"><label>Years of Exp</label><input type="number" class="form-control" formControlName="experience"></div>
          </div>
          <div class="form-group"><label>Tech Stack / Expertise</label><input type="text" class="form-control" formControlName="skills"></div>
          <div class="form-group"><label>Current Organization (Optional)</label><input type="text" class="form-control" formControlName="currentOrganization"></div>

          <div class="form-error text-center mb-4" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary w-100" [disabled]="isLoading">Register</button>
        </form>

        <!-- Organization Form -->
        <form *ngIf="selectedRole === 'ORG'" [formGroup]="orgForm" (ngSubmit)="onSubmit(orgForm)">
          <div class="form-grid">
            <div class="form-group"><label>Organization Name</label><input type="text" class="form-control" formControlName="name"></div>
            <div class="form-group"><label>Company Email</label><input type="email" class="form-control" formControlName="email"></div>
            <div class="form-group">
              <label>Password</label><input type="password" class="form-control" formControlName="password">
              <span class="form-error" *ngIf="hasError(orgForm, 'password')">At least 8 chars, 1 uppercase, 1 lowercase, 1 number</span>
            </div>
            <div class="form-group"><label>Industry Type</label><input type="text" class="form-control" formControlName="industryType"></div>
            <div class="form-group"><label>Contact Person</label><input type="text" class="form-control" formControlName="contactPerson"></div>
            <div class="form-group">
              <label>Contact Phone</label><input type="text" class="form-control" formControlName="contactPhone">
              <span class="form-error" *ngIf="hasError(orgForm, 'contactPhone')">Must be exactly 10 digits</span>
            </div>
          </div>
          <div class="form-group"><label>Address</label><input type="text" class="form-control" formControlName="address"></div>
          <div class="form-group"><label>Website (Optional)</label><input type="text" class="form-control" formControlName="website"></div>

          <div class="form-error text-center mb-4" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary w-100" [disabled]="isLoading">Register</button>
        </form>

        <p class="auth-footer text-center mt-6">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: flex-start; min-height: calc(100vh - 120px); padding-top: 40px; padding-bottom: 40px;}
    .register-card { width: 100%; max-width: 700px; padding: 40px; }
    .auth-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; text-align: center; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .auth-subtitle { color: var(--text-muted); font-size: 15px; text-align: center; }
    .role-selector { display: flex; background: rgba(15, 23, 42, 0.6); border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border); }
    .role-selector button { flex: 1; padding: 14px; background: transparent; color: var(--text-muted); border: none; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.3s; }
    .role-selector button:hover { background: rgba(255, 255, 255, 0.05); }
    .role-selector button.active { background: var(--primary); color: white; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
    .mb-6 { margin-bottom: 24px; }
    .mt-6 { margin-top: 24px; }
    .mb-4 { margin-bottom: 16px; }
    .text-center { text-align: center; }
    .w-100 { width: 100%; }
    .auth-footer { color: var(--text-muted); font-size: 14px; }
    .auth-footer a { color: var(--primary); text-decoration: none; font-weight: 500; }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .role-selector { flex-direction: column; } }
  `]
})
export class RegisterComponent {
  selectedRole: 'CANDIDATE' | 'INTERVIEWER' | 'ORG' = 'CANDIDATE';
  
  candidateForm: FormGroup;
  interviewerForm: FormGroup;
  orgForm: FormGroup;
  
  isLoading = false;
  errorMessage = '';

  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\S]{8,}$';
  phonePattern = '^\\d{10}$';
  aadhaarPattern = '^\\d{12}$';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      aadhaar: ['', [Validators.required, Validators.pattern(this.aadhaarPattern)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      highestQualification: ['', Validators.required],
      skills: ['', Validators.required],
      experience: [0]
    });

    this.interviewerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      aadhaar: ['', [Validators.required, Validators.pattern(this.aadhaarPattern)]],
      skills: ['', Validators.required],
      experience: [0, [Validators.required, Validators.min(0)]],
      currentOrganization: ['']
    });

    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      contactPhone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      address: ['', Validators.required],
      industryType: ['', Validators.required],
      website: [''],
      contactPerson: ['', Validators.required]
    });
  }

  selectRole(role: 'CANDIDATE' | 'INTERVIEWER' | 'ORG') {
    this.selectedRole = role;
    this.errorMessage = '';
  }

  hasError(form: FormGroup, field: string) {
    const control = form.get(field);
    return control?.touched && control?.invalid;
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      let reqUrl: any;
      if (this.selectedRole === 'CANDIDATE') reqUrl = this.authService.registerCandidate(form.value);
      else if (this.selectedRole === 'INTERVIEWER') reqUrl = this.authService.registerInterviewer(form.value);
      else if (this.selectedRole === 'ORG') reqUrl = this.authService.registerOrganization(form.value);

      reqUrl.subscribe({
        next: (res: any) => {
          this.isLoading = false;
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      Object.keys(form.controls).forEach(key => form.get(key)?.markAsTouched());
    }
  }
}
