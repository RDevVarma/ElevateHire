import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container animate-in">
      <div class="header-section mb-6">
        <h1 class="title-gradient">Candidate Dashboard</h1>
        <div class="role-selector" style="max-width: 500px; margin-top: 16px;">
          <button [class.active]="activeTab === 'BROWSE_JOBS'" (click)="activeTab = 'BROWSE_JOBS'">Browse Jobs</button>
          <button [class.active]="activeTab === 'MY_APPLICATIONS'" (click)="activeTab = 'MY_APPLICATIONS'">My Applications</button>
          <button [class.active]="activeTab === 'MY_INTERVIEWS'" (click)="activeTab = 'MY_INTERVIEWS'">My Interviews</button>
        </div>
      </div>

      <!-- BROWSE JOBS TAB -->
      <div *ngIf="activeTab === 'BROWSE_JOBS'" class="jobs-list">
        <div *ngIf="jobs.length === 0" class="glass-card text-center">No jobs available right now.</div>
        
        <div class="glass-card mb-4" *ngFor="let job of jobs">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="margin-bottom: 5px;">{{job.title}} <span class="badge badge-success">New</span></h3>
              <p style="color: var(--text-muted); font-size: 14px;">🏢 {{job.organization?.name}} | 📍 {{job.location}} | 🎯 Exp: {{job.minExperience}} yrs</p>
            </div>
            <button class="btn-primary" (click)="apply(job.id)">Apply Now</button>
          </div>
          <div class="mt-4">
            <p>{{job.description}}</p>
            <div style="font-size: 14px; border-top: 1px solid var(--glass-border); padding-top: 10px; margin-top: 10px;">
              <strong>Skills Required:</strong> {{job.requiredSkills}} <br>
              <strong>Deadline:</strong> {{job.deadline | date:'medium'}}
            </div>
          </div>
        </div>
      </div>

      <!-- MY APPLICATIONS TAB -->
      <div *ngIf="activeTab === 'MY_APPLICATIONS'">
        <div *ngIf="applications.length === 0" class="glass-card text-center">You haven't applied to any jobs yet.</div>
        
        <div class="glass-card mb-4" *ngFor="let app of applications">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="margin-bottom: 5px;">{{app.job?.title}} ({{app.job?.organization?.name}})</h3>
              <p style="color: var(--text-muted); font-size: 14px;">Applied At: {{app.appliedAt | date:'medium'}}</p>
            </div>
            <span class="badge" [ngClass]="{
              'badge-success': app.status === 'SELECTED',
              'badge-danger': app.status === 'REJECTED',
              'badge-warning': app.status === 'HOLD',
              'badge-info': app.status === 'APPLIED' || app.status.includes('INTERVIEW')
            }">{{app.status.replace('_', ' ')}}</span>
          </div>
        </div>
      </div>

      <!-- MY INTERVIEWS TAB -->
      <div *ngIf="activeTab === 'MY_INTERVIEWS'">
        <div *ngIf="interviews.length === 0" class="glass-card text-center">No interviews scheduled yet.</div>
        
        <div class="glass-card mb-4" *ngFor="let interview of interviews">
          <h3 style="margin-bottom: 5px;">Interview for: {{interview.application?.job?.title}}</h3>
          <p style="color: var(--text-muted); font-size: 14px;">With: {{interview.interviewer?.name}}</p>
          
          <div class="mt-4" style="background: rgba(15, 23, 42, 0.4); border-radius: 8px; padding: 16px;">
            <p><strong>📅 Date:</strong> {{interview.interviewDate}} <strong>🕒 Time:</strong> {{interview.interviewTime}}</p>
            <p><strong>🎥 Mode:</strong> {{interview.mode}}</p>
            <p *ngIf="interview.meetingLink"><strong>🔗 Link:</strong> <a [href]="getSafeLink(interview.meetingLink)" target="_blank" style="color: var(--primary);">Join Meeting</a></p>
            <div class="mt-4">
              <span class="badge badge-info">Status: {{interview.status}}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px 0; }
    .header-section { margin-bottom: 30px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }
    .text-center { text-align: center; }
    .role-selector { display: flex; background: rgba(15, 23, 42, 0.6); border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border); }
    .role-selector button { flex: 1; padding: 10px; background: transparent; color: var(--text-muted); border: none; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.3s; }
    .role-selector button.active { background: var(--primary); color: white; }
    .title-gradient { font-size: 28px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .badge-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; }
  `]
})
export class CandidateDashboardComponent implements OnInit {
  activeTab = 'BROWSE_JOBS';
  jobs: any[] = [];
  applications: any[] = [];
  interviews: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadJobs();
    this.loadApplications();
    this.loadInterviews();
  }

  getSafeLink(link: string): string {
    if (!link) return '#';
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      return 'https://' + link;
    }
    return link;
  }

  loadJobs() {
    this.dataService.getActiveJobs().subscribe(res => this.jobs = res);
  }

  loadApplications() {
    this.dataService.getMyApplications().subscribe(res => this.applications = res);
  }

  loadInterviews() {
    this.dataService.getCandidateInterviews().subscribe(res => this.interviews = res);
  }

  apply(jobId: number) {
    this.dataService.applyForJob(jobId).subscribe({
      next: () => {
        alert('Successfully applied to job!');
        this.loadApplications();
        this.activeTab = 'MY_APPLICATIONS';
      },
      error: (err) => {
        alert(err.error?.message || 'Error occurred while applying.');
      }
    });
  }
}
