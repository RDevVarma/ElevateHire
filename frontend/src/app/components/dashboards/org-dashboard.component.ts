import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-org-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="dashboard-container animate-in">
      <div class="header-section mb-6">
        <h1 class="auth-title">Organization Dashboard</h1>
        <div class="role-selector" style="max-width: 500px; margin-top: 16px;">
          <button [class.active]="activeTab === 'POST_JOB'" (click)="activeTab = 'POST_JOB'">Post Job</button>
          <button [class.active]="activeTab === 'ACTIVE_JOBS'" (click)="activeTab = 'ACTIVE_JOBS'">Active Jobs</button>
          <button [class.active]="activeTab === 'COMPLETED_JOBS'" (click)="activeTab = 'COMPLETED_JOBS'">Completed Jobs</button>
          <button [class.active]="activeTab === 'VIEW_FEEDBACK'" (click)="activeTab = 'VIEW_FEEDBACK'">View Feedback</button>
        </div>
      </div>

      <!-- POST JOB TAB -->
      <div *ngIf="activeTab === 'POST_JOB'" class="glass-card">
        <h3 class="mb-4">Create New Job Requisition</h3>
        <form [formGroup]="jobForm" (ngSubmit)="postJob()">
          <div class="form-grid">
            <div class="form-group"><label>Job Title</label><input type="text" class="form-control" formControlName="title"></div>
            <div class="form-group"><label>Location</label><input type="text" class="form-control" formControlName="location"></div>
            <div class="form-group"><label>Min Experience (Years)</label><input type="number" class="form-control" formControlName="minExperience"></div>
            <div class="form-group"><label>Open Positions</label><input type="number" class="form-control" formControlName="openPositions"></div>
            <div class="form-group"><label>Application Deadline</label><input type="datetime-local" class="form-control" formControlName="deadline"></div>
          </div>
          <div class="form-group"><label>Required Skills (comma separated)</label><input type="text" class="form-control" formControlName="requiredSkills"></div>
          <div class="form-group">
            <label>Job Description</label>
            <textarea class="form-control" rows="4" formControlName="description"></textarea>
          </div>
          <div class="form-error text-center mb-4" *ngIf="formError">{{ formError }}</div>
          <button type="submit" class="btn-primary">Post Job</button>
        </form>
      </div>

      <!-- ACTIVE JOBS TAB -->
      <div *ngIf="activeTab === 'ACTIVE_JOBS'" class="jobs-list">
        <div *ngIf="activeJobs.length === 0" class="glass-card text-center">No active jobs found.</div>
        
        <div class="glass-card mb-4" *ngFor="let job of activeJobs">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="margin-bottom: 5px;">{{job.title}} <span class="badge badge-success">{{job.status}}</span></h3>
              <p style="color: var(--text-muted); font-size: 14px;">📍 {{job.location}} | 🎯 Exp: {{job.minExperience}} yrs | 👥 Openings: {{job.openPositions}}</p>
            </div>
            <div>
              <button class="btn-outline" (click)="viewJobDetails(job)">View Details / Applications</button>
              <button class="btn-outline ml-2" (click)="deleteJob(job.id)" style="color: var(--danger); border-color: var(--danger);">Delete</button>
            </div>
          </div>
          <div class="mt-4" style="font-size: 14px; border-top: 1px solid var(--glass-border); padding-top: 10px;">
            <strong>Skills:</strong> {{job.requiredSkills}} <br>
            <strong>Deadline:</strong> {{job.deadline | date:'medium'}}
          </div>
        </div>
      </div>

      <!-- COMPLETED JOBS TAB -->
      <div *ngIf="activeTab === 'COMPLETED_JOBS'" class="jobs-list">
        <div *ngIf="completedJobs.length === 0" class="glass-card text-center">No completed jobs yet.</div>
        
        <div class="glass-card mb-4" *ngFor="let job of completedJobs" style="opacity: 0.8;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="margin-bottom: 5px;">{{job.title}} <span class="badge badge-info">{{job.status}}</span></h3>
              <p style="color: var(--text-muted); font-size: 14px;">📍 {{job.location}} | 🎯 Exp: {{job.minExperience}} yrs | 👥 Openings: {{job.openPositions}}</p>
            </div>
            <button class="btn-outline" (click)="viewJobDetails(job)">View Details / Applications</button>
          </div>
          <div class="mt-4" style="font-size: 14px; border-top: 1px solid var(--glass-border); padding-top: 10px;">
            <strong>Skills:</strong> {{job.requiredSkills}} <br>
            <strong>Deadline:</strong> {{job.deadline | date:'medium'}}
          </div>
        </div>
      </div>

      <!-- VIEW FEEDBACK TAB -->
      <div *ngIf="activeTab === 'VIEW_FEEDBACK'" class="jobs-list animate-in">
        <div *ngIf="completedInterviews.length === 0" class="glass-card text-center" style="font-style: italic; color: var(--text-muted);">
          No candidate feedback available yet.
        </div>
        
        <div class="glass-card mb-4" *ngFor="let fb of completedInterviews">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h4 style="margin: 0; color: var(--primary); font-size: 20px;">Candidate: {{fb.application?.candidate?.name}}</h4>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: var(--text-muted);">
                  Role: <strong>{{fb.application?.job?.title}}</strong> <br>
                  Tech Stack: <span style="color: #fff;">{{fb.application?.candidate?.skills}}</span>
                </p>
              </div>
              <div style="text-align: right;">
                <span class="badge" [ngClass]="{
                  'badge-success': fb.recommendation === 'SELECTED',
                  'badge-danger': fb.recommendation === 'REJECTED',
                  'badge-warning': fb.recommendation === 'HOLD'
                }" style="font-size: 14px; padding: 6px 12px; display: inline-block; margin-bottom: 10px;">{{fb.recommendation}}</span>
                <br>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                  <button class="btn-primary" style="font-size: 12px; padding: 5px 15px;" *ngIf="fb.application?.status === 'INTERVIEW_COMPLETED'" (click)="updateAppStatus(fb.application?.id, 'SELECTED')">Approve Selection</button>
                  <button class="btn-outline" style="font-size: 12px; padding: 5px 15px; color: var(--danger); border-color: var(--danger);" *ngIf="fb.application?.status === 'INTERVIEW_COMPLETED'" (click)="updateAppStatus(fb.application?.id, 'REJECTED')">Reject Application</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="feedback-card">
            <div class="metrics-grid mb-4">
              <div class="metric-box">
                <span class="label">Technical</span>
                <span class="score" [style.color]="fb.technicalRating >= 7 ? '#10b981' : (fb.technicalRating >= 4 ? '#f59e0b' : '#ef4444')">{{fb.technicalRating}}/10</span>
              </div>
              <div class="metric-box">
                <span class="label">Communication</span>
                <span class="score" [style.color]="fb.communicationRating >= 7 ? '#10b981' : (fb.communicationRating >= 4 ? '#f59e0b' : '#ef4444')">{{fb.communicationRating}}/10</span>
              </div>
              <div class="metric-box">
                <span class="label">Problem Solving</span>
                <span class="score" [style.color]="fb.problemSolvingRating >= 7 ? '#10b981' : (fb.problemSolvingRating >= 4 ? '#f59e0b' : '#ef4444')">{{fb.problemSolvingRating}}/10</span>
              </div>
            </div>
            
            <div class="assessment-box" style="margin-bottom: 0;">
              <h5 style="margin-top: 0; color: var(--text-muted);">Interviewer Comments ({{fb.interviewer?.name}}):</h5>
              <p style="font-size: 14px; line-height: 1.5; margin-bottom: 0;">"{{fb.overallAssessment}}"</p>
            </div>
          </div>
        </div>
      </div>

      <!-- JOB DETAILS MODAL (simulated inline) -->
      <div *ngIf="activeTab === 'JOB_DETAILS' && selectedJob" class="animate-in">
        <button class="btn-outline mb-4" (click)="activeTab = selectedJob.status === 'COMPLETED' ? 'COMPLETED_JOBS' : 'ACTIVE_JOBS'">&larr; Back to Jobs</button>
        
        <div class="glass-card mb-4">
          <h2>{{selectedJob.title}}</h2>
          <p>{{selectedJob.description}}</p>
          <div class="mt-4" style="display: flex; gap: 10px;" *ngIf="selectedJob.status !== 'COMPLETED'">
            <button class="btn-primary" (click)="showAssignSection = true">Assign Interviewers</button>
            <button class="btn-outline" (click)="markComplete(selectedJob.id)" style="color: var(--warning); border-color: var(--warning);">Mark as Completed</button>
          </div>
        </div>

        <!-- Search and Invite Interviewers -->
        <div class="glass-card mb-4" style="border: 1px solid var(--primary);">
          <h4 class="mb-4">Invite Interviewers</h4>
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <input type="text" class="form-control" placeholder="Search by Tech Stack (e.g. Java)" [(ngModel)]="searchSkill">
            <button class="btn-primary" (click)="searchInterviewers()">Search</button>
          </div>
          
          <div *ngIf="searchResults.length > 0">
            <h5>Search Results:</h5>
            <div class="glass-card mt-4" *ngFor="let intv of searchResults" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 10px; background: rgba(255,255,255,0.05);">
              <div>
                <strong>{{intv.name}}</strong> (ID: {{intv.interviewerId}})<br>
                <span style="font-size: 13px; color: var(--text-muted);">Tech Stack: {{intv.skills}} | Exp: {{intv.experience}} yrs</span>
              </div>
              <button class="btn-primary" style="padding: 5px 15px; font-size: 13px;" (click)="sendInvite(intv.userId)">Send Invite</button>
            </div>
          </div>
          <p *ngIf="searchResults.length === 0 && searchSkill" style="font-size: 13px; color: var(--text-muted);">No interviewers found with that tech stack.</p>

          <h5 class="mt-4 mb-4">Sent Invitations</h5>
          <div *ngIf="sentInvitations.length === 0" style="font-size: 13px; color: var(--text-muted);">No invitations sent yet.</div>
          <div class="glass-card" *ngFor="let inv of sentInvitations" style="display: flex; justify-content: space-between; padding: 10px; margin-bottom: 5px; background: rgba(0,0,0,0.2);">
            <div>
              <strong>{{inv.interviewer.name}}</strong> (ID: {{inv.interviewer.interviewerId}})
            </div>
            <span class="badge" [ngClass]="{'badge-warning': inv.status === 'PENDING', 'badge-success': inv.status === 'ACCEPTED', 'badge-danger': inv.status === 'DECLINED'}">
              {{inv.status}}
            </span>
          </div>
        </div>

        <h3>Job Applications</h3>
        <div class="glass-card mb-4" *ngFor="let app of selectedApplications">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <h4 style="margin: 0;">{{app.candidate.name}} (ID: {{app.candidate.user.id}})</h4>
              <p style="font-size: 13px; color: var(--text-muted);">Status: <span class="badge badge-info">{{app.status}}</span></p>
              <p style="font-size: 13px;">Assigned Interviewer: {{app.assignedInterviewer ? app.assignedInterviewer.name : 'Unassigned'}}</p>
            </div>
            <div>
              <button class="btn-primary" *ngIf="app.status === 'INTERVIEW_COMPLETED'" (click)="updateAppStatus(app.id, 'SELECTED')">Select</button>
              <button class="btn-outline ml-2" *ngIf="app.status === 'INTERVIEW_COMPLETED'" (click)="updateAppStatus(app.id, 'REJECTED')" style="color: var(--danger); border-color: var(--danger);">Reject</button>
            </div>
          </div>
          
          <!-- Automatically inline the feedback if available -->
          <div *ngIf="app.interviews && app.interviews.length > 0" class="mt-4 p-4 animate-in" style="background: rgba(15,23,42,0.8); border: 1px solid var(--primary); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 15px;">
              <h4 style="margin: 0; color: var(--primary);">Interview Evaluation Report</h4>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: var(--text-muted);">
                Candidate: <strong>{{app.candidate.name}}</strong> | Role: {{selectedJob.title}} <br>
                Tech Stack: <span style="color: #fff;">{{app.candidate.skills}}</span>
              </p>
            </div>
            
            <div *ngFor="let fb of app.interviews" class="feedback-card">
              <div class="metrics-grid mb-4">
                <div class="metric-box">
                  <span class="label">Technical</span>
                  <span class="score" [style.color]="fb.technicalRating >= 7 ? '#10b981' : (fb.technicalRating >= 4 ? '#f59e0b' : '#ef4444')">{{fb.technicalRating}}/10</span>
                </div>
                <div class="metric-box">
                  <span class="label">Communication</span>
                  <span class="score" [style.color]="fb.communicationRating >= 7 ? '#10b981' : (fb.communicationRating >= 4 ? '#f59e0b' : '#ef4444')">{{fb.communicationRating}}/10</span>
                </div>
                <div class="metric-box">
                  <span class="label">Problem Solving</span>
                  <span class="score" [style.color]="fb.problemSolvingRating >= 7 ? '#10b981' : (fb.problemSolvingRating >= 4 ? '#f59e0b' : '#ef4444')">{{fb.problemSolvingRating}}/10</span>
                </div>
              </div>
              
              <div class="assessment-box mb-4">
                <h5 style="margin-top: 0; color: var(--text-muted);">Interviewer Comments:</h5>
                <p style="font-size: 14px; line-height: 1.5;">"{{fb.overallAssessment}}"</p>
              </div>
              
              <div style="text-align: right; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                <strong>Final Recommendation: </strong> 
                <span class="badge" [ngClass]="{
                  'badge-success': fb.recommendation === 'SELECTED',
                  'badge-danger': fb.recommendation === 'REJECTED',
                  'badge-warning': fb.recommendation === 'HOLD'
                }" style="font-size: 14px; padding: 6px 12px;">{{fb.recommendation}}</span>
              </div>
            </div>
          </div>
        </div>
        <p *ngIf="selectedApplications.length === 0">No applications received yet.</p>
      </div>

    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px 0; }
    .header-section { margin-bottom: 30px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .metric-box { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
    .metric-box .label { display: block; font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .metric-box .score { display: block; font-size: 24px; font-weight: bold; margin-top: 5px; }
    .assessment-box { background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border-left: 3px solid var(--primary); }
    .feedback-card { background: transparent; padding: 0; }
    .mb-6 { margin-bottom: 24px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    .p-4 { padding: 16px; }
    .ml-2 { margin-left: 8px; }
    .text-center { text-align: center; }
    .role-selector { display: flex; background: rgba(15, 23, 42, 0.6); border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border); }
    .role-selector button { flex: 1; padding: 10px; background: transparent; color: var(--text-muted); border: none; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.3s; }
    .role-selector button.active { background: var(--primary); color: white; }
    .auth-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  `]
})
export class OrgDashboardComponent implements OnInit {
  activeTab = 'ACTIVE_JOBS';
  jobForm: FormGroup;
  activeJobs: any[] = [];
  completedJobs: any[] = [];
  completedInterviews: any[] = [];
  selectedJob: any = null;
  selectedApplications: any[] = [];
  showAssignSection = false;
  searchSkill: string = '';
  searchResults: any[] = [];
  sentInvitations: any[] = [];
  feedbackAppId: number | null = null;
  appFeedback: any[] = [];
  formError = '';

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requiredSkills: ['', Validators.required],
      minExperience: [0, Validators.required],
      openPositions: [1, Validators.required],
      deadline: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadJobs();
    this.loadCompletedInterviews();
  }

  loadJobs() {
    this.dataService.getOrgJobs().subscribe((res: any[]) => {
      this.activeJobs = res.filter(job => job.status !== 'COMPLETED');
      this.completedJobs = res.filter(job => job.status === 'COMPLETED');
    });
  }

  loadCompletedInterviews() {
    this.dataService.getOrgInterviews().subscribe((res: any) => {
      this.completedInterviews = res;
    });
  }

  postJob() {
    this.formError = '';
    if (this.jobForm.valid) {
      const formValue = { ...this.jobForm.value };
      if (formValue.deadline) {
        // Convert local datetime to ISO string for backend
        formValue.deadline = new Date(formValue.deadline).toISOString();
      }
      this.dataService.createJob(formValue).subscribe({
        next: (res) => {
          alert('Job posted successfully!');
          this.jobForm.reset({ openPositions: 1, minExperience: 0 });
          this.activeTab = 'ACTIVE_JOBS';
          this.loadJobs();
        },
        error: (err) => alert('Failed to post job: ' + (err.error?.message || 'Unknown error'))
      });
    } else {
      this.formError = 'Please fill out all required fields correctly.';
      Object.keys(this.jobForm.controls).forEach(key => this.jobForm.get(key)?.markAsTouched());
    }
  }

  viewJobDetails(job: any) {
    this.selectedJob = job;
    this.activeTab = 'JOB_DETAILS';
    this.showAssignSection = false;
    this.feedbackAppId = null;
    this.searchSkill = '';
    this.searchResults = [];
    this.loadApplications(job.id);
    this.loadSentInvitations(job.id);
  }

  loadApplications(jobId: number) {
    this.dataService.getJobApplications(jobId).subscribe(res => {
      this.selectedApplications = res;
      // Auto-fetch feedback for applications that have interviews
      this.selectedApplications.forEach(app => {
        if (app.status === 'INTERVIEW_COMPLETED' || app.status === 'SELECTED' || app.status === 'REJECTED') {
          this.dataService.getAppInterviews(app.id).subscribe(interviews => {
            app.interviews = interviews;
          });
        }
      });
    });
  }

  loadSentInvitations(jobId: number) {
    this.dataService.getJobInvitationsSent(jobId).subscribe(res => {
      this.sentInvitations = res;
    });
  }

  searchInterviewers() {
    if (this.searchSkill.trim()) {
      this.dataService.searchInterviewers(this.searchSkill.trim()).subscribe(res => {
        this.searchResults = res;
      });
    }
  }

  sendInvite(interviewerUserId: number) {
    if (this.selectedJob) {
      this.dataService.sendJobInvitation(this.selectedJob.id, interviewerUserId).subscribe({
        next: (res) => {
          alert('Invitation sent successfully!');
          this.loadSentInvitations(this.selectedJob.id);
        },
        error: (err) => alert('Failed to send invite: ' + (err.error?.message || 'Unknown error'))
      });
    }
  }

  viewFeedback(appId: number) {
    this.feedbackAppId = appId;
    this.dataService.getAppInterviews(appId).subscribe(res => {
      console.log('Fetched feedback for app', appId, res);
      this.appFeedback = res;
    });
  }

  updateAppStatus(appId: number, status: string) {
    this.dataService.updateAppStatus(appId, status).subscribe(res => {
      alert(`Application marked as ${status}`);
      if (this.selectedJob) {
        this.loadApplications(this.selectedJob.id);
      }
      this.loadCompletedInterviews(); // Refresh the feedback tab data as well
    });
  }

  markComplete(jobId: number) {
    if(confirm('Are you sure you want to mark this job as completed?')) {
      this.dataService.markJobCompleted(jobId).subscribe(res => {
        alert('Job completed.');
        this.activeTab = 'ACTIVE_JOBS';
        this.loadJobs();
      });
    }
  }

  deleteJob(jobId: number) {
    if(confirm('Are you sure you want to permanently delete this job? This action cannot be undone.')) {
      this.dataService.deleteJob(jobId).subscribe({
        next: (res) => {
          alert('Job deleted successfully.');
          this.loadJobs();
        },
        error: (err) => alert('Failed to delete job: ' + (err.error?.message || 'Unknown error'))
      });
    }
  }
}
