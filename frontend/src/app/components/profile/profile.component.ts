import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container animate-in">
      <div class="glass-card profile-card">
        <div class="text-center mb-6">
          <div class="profile-avatar mb-4">
            <span>{{role?.charAt(0)}}</span>
          </div>
          <h2 class="auth-title">My Profile</h2>
          <p class="auth-subtitle">{{role | titlecase}} Account</p>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
          
          <!-- CANDIDATE FIELDS -->
          <ng-container *ngIf="role === 'CANDIDATE'">
            <div class="form-grid">
              <div class="form-group"><label>Full Name</label><input type="text" class="form-control" formControlName="name"></div>
              <div class="form-group"><label>Phone Number</label><input type="text" class="form-control" formControlName="phone"></div>
              <div class="form-group"><label>Highest Qualification</label><input type="text" class="form-control" formControlName="highestQualification"></div>
              <div class="form-group"><label>Years of Exp</label><input type="number" class="form-control" formControlName="experience"></div>
            </div>
            <div class="form-group"><label>Skills</label><input type="text" class="form-control" formControlName="skills"></div>
            <!-- Read-only fields -->
            <div class="form-grid mt-4">
              <div class="form-group"><label>Aadhaar (Verified)</label><input type="text" class="form-control" [value]="profileData?.aadhaar" disabled></div>
              <div class="form-group"><label>Email</label><input type="text" class="form-control" [value]="profileData?.user?.email" disabled></div>
            </div>
          </ng-container>

          <!-- INTERVIEWER FIELDS -->
          <ng-container *ngIf="role === 'INTERVIEWER'">
            <div class="form-grid">
              <div class="form-group"><label>Name</label><input type="text" class="form-control" formControlName="name"></div>
              <div class="form-group"><label>Phone</label><input type="text" class="form-control" formControlName="phone"></div>
              <div class="form-group"><label>Years of Exp</label><input type="number" class="form-control" formControlName="experience"></div>
              <div class="form-group"><label>Current Org</label><input type="text" class="form-control" formControlName="currentOrganization"></div>
            </div>
            <div class="form-group"><label>Skills / Expertise</label><input type="text" class="form-control" formControlName="skills"></div>
            <!-- Read-only fields -->
            <div class="form-grid mt-4">
              <div class="form-group"><label>Aadhaar (Verified)</label><input type="text" class="form-control" [value]="profileData?.aadhaar" disabled></div>
              <div class="form-group"><label>Email</label><input type="text" class="form-control" [value]="profileData?.user?.email" disabled></div>
            </div>
          </ng-container>

          <!-- ORGANIZATION FIELDS -->
          <ng-container *ngIf="role === 'ORG'">
            <div class="form-grid">
              <div class="form-group"><label>Organization Name</label><input type="text" class="form-control" formControlName="name"></div>
              <div class="form-group"><label>Contact Phone</label><input type="text" class="form-control" formControlName="phone"></div>
              <div class="form-group"><label>Industry Type</label><input type="text" class="form-control" formControlName="industryType"></div>
              <div class="form-group"><label>Contact Person</label><input type="text" class="form-control" formControlName="contactPerson"></div>
              <div class="form-group"><label>Website</label><input type="url" class="form-control" formControlName="website"></div>
            </div>
            <div class="form-group"><label>Address</label><input type="text" class="form-control" formControlName="address"></div>
            <!-- Read-only fields -->
            <div class="form-group mt-4"><label>Company Email</label><input type="text" class="form-control" [value]="profileData?.user?.email" disabled></div>
          </ng-container>

          <button type="submit" class="btn-primary w-100" [disabled]="isSaving">
            <span *ngIf="!isSaving">Save Changes</span>
            <span *ngIf="isSaving">Saving...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container { display: flex; justify-content: center; padding-top: 40px; padding-bottom: 40px; }
    .profile-card { width: 100%; max-width: 650px; padding: 40px; }
    .profile-avatar { width: 80px; height: 80px; border-radius: 40px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; margin: 0 auto; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4); }
    .auth-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .auth-subtitle { color: var(--text-muted); font-size: 15px; }
    .text-center { text-align: center; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }
    .w-100 { width: 100%; }
  `]
})
export class ProfileComponent implements OnInit {
  role: string | null = '';
  profileData: any;
  profileForm: FormGroup;
  isSaving = false;

  constructor(private authService: AuthService, private dataService: DataService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({});
  }

  ngOnInit() {
    this.role = this.authService.getRole();
    this.initForm();
    this.loadProfile();
  }

  initForm() {
    if (this.role === 'CANDIDATE') {
      this.profileForm = this.fb.group({
        name: [''], phone: [''], highestQualification: [''], skills: [''], experience: ['']
      });
    } else if (this.role === 'INTERVIEWER') {
      this.profileForm = this.fb.group({
        name: [''], phone: [''], skills: [''], experience: [''], currentOrganization: ['']
      });
    } else if (this.role === 'ORG') {
      this.profileForm = this.fb.group({
        name: [''], phone: [''], address: [''], industryType: [''], website: [''], contactPerson: ['']
      });
    }
  }

  getRolePath() {
    return this.role === 'ORG' ? 'organization' : this.role?.toLowerCase() || '';
  }

  loadProfile() {
    this.dataService.getProfile(this.getRolePath()).subscribe(res => {
      this.profileData = res;
      // Patch form with updatable values
      if (this.role === 'CANDIDATE' || this.role === 'INTERVIEWER') {
        this.profileForm.patchValue(res);
      } else if (this.role === 'ORG') {
        this.profileForm.patchValue({
          name: res.name, phone: res.contactPhone, address: res.address,
          industryType: res.industryType, website: res.website, contactPerson: res.contactPerson
        });
      }
    });
  }

  updateProfile() {
    this.isSaving = true;
    this.dataService.updateProfile(this.getRolePath(), this.profileForm.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        alert('Profile updated successfully!');
        this.profileData = res;
      },
      error: () => {
        this.isSaving = false;
        alert('Failed to update profile.');
      }
    });
  }
}
