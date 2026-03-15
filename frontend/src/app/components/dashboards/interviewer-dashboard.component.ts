import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-interviewer-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-container animate-in">
      <div class="header-section mb-6">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1 class="title-gradient">Interviewer Dashboard</h1>
          <div *ngIf="profile" class="badge badge-info" style="font-size: 16px; padding: 8px 16px;">
            My ID: <strong>{{profile.interviewerId}}</strong>
          </div>
        </div>
        <div class="role-selector" style="max-width: 600px; margin-top: 16px;">
          <button [class.active]="activeTab === 'JOB_INVITATIONS'" (click)="activeTab = 'JOB_INVITATIONS'">Job Invitations</button>
          <button [class.active]="activeTab === 'ASSIGNED_CANDIDATES'" (click)="activeTab = 'ASSIGNED_CANDIDATES'">Assigned Candidates</button>
          <button [class.active]="activeTab === 'MY_INTERVIEWS'" (click)="activeTab = 'MY_INTERVIEWS'">My Interviews</button>
        </div>
      </div>

      <!-- JOB INVITATIONS TAB -->
      <div *ngIf="activeTab === 'JOB_INVITATIONS'">
        <div *ngIf="invitations.length === 0" class="glass-card text-center">No pending job invitations.</div>
        
        <div class="glass-card mb-4" *ngFor="let inv of invitations">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="margin-bottom: 5px;">{{inv.job?.title}} <span class="badge" [ngClass]="{'badge-warning': inv.status === 'PENDING', 'badge-success': inv.status === 'ACCEPTED', 'badge-danger': inv.status === 'DECLINED'}">{{inv.status}}</span></h3>
              <p style="font-size: 14px; margin-bottom: 8px;">🏢 {{inv.job?.organization?.name}} | 📍 {{inv.job?.location}} | 🎯 Exp: {{inv.job?.minExperience}} yrs</p>
              <p style="font-size: 14px; color: var(--text-muted);">{{inv.job?.description}}</p>
            </div>
            
            <div *ngIf="inv.status === 'PENDING'" style="display: flex; gap: 10px;">
              <button class="btn-primary" (click)="respondToInvite(inv.id, true)">Accept</button>
              <button class="btn-outline" style="color: var(--danger); border-color: var(--danger);" (click)="respondToInvite(inv.id, false)">Decline</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ASSIGNED CANDIDATES TAB -->
      <div *ngIf="activeTab === 'ASSIGNED_CANDIDATES'">
        <div *ngIf="applications.length === 0" class="glass-card text-center">No candidates assigned to you at the moment.</div>
        
        <div class="glass-card mb-4" *ngFor="let app of applications">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h3 style="margin-bottom: 5px;">{{app.candidate?.name}} - <span style="font-size: 16px; color: var(--text-muted);">{{app.job?.title}}</span></h3>
              <p style="font-size: 14px; margin-bottom: 4px;">🎯 Tech Stack: {{app.candidate?.skills}} | ⏱ Exp: {{app.candidate?.experience}} yrs</p>
              <p style="font-size: 14px; margin-bottom: 4px;">🎓 Qual: {{app.candidate?.highestQualification}} | 📱 Phone: {{app.candidate?.phone}}</p>
            </div>
            
            <button class="btn-primary" *ngIf="app.status === 'APPLIED'" (click)="openScheduleModal(app)">Schedule Interview</button>
            <span class="badge badge-success" *ngIf="app.status !== 'APPLIED'">{{app.status.replace('_', ' ')}}</span>
          </div>

          <!-- Schedule Modal Inline -->
          <div *ngIf="scheduleAppId === app.id" class="mt-4 form-box animate-in">
            <h4 class="mb-4">Schedule Interview for {{app.candidate?.name}}</h4>
            <form [formGroup]="scheduleForm" (ngSubmit)="scheduleInterview()">
              <div class="form-grid">
                <div class="form-group"><label>Date</label><input type="date" class="form-control" formControlName="interviewDate"></div>
                <div class="form-group"><label>Time</label><input type="time" class="form-control" formControlName="interviewTime"></div>
                <div class="form-group">
                  <label>Mode</label>
                  <select class="form-control" formControlName="mode">
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
                <div class="form-group"><label>Meeting Link</label><input type="text" class="form-control" formControlName="meetingLink"></div>
              </div>
              <div style="display: flex; gap: 10px;">
                <button type="submit" class="btn-primary" [disabled]="scheduleForm.invalid">Send Invite</button>
                <button type="button" class="btn-outline" (click)="scheduleAppId = null">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- MY INTERVIEWS TAB -->
      <div *ngIf="activeTab === 'MY_INTERVIEWS'">
        <div *ngIf="interviews.length === 0" class="glass-card text-center">No interviews scheduled.</div>
        
        <div class="glass-card mb-4" *ngFor="let interview of interviews">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <h3 style="margin-bottom: 5px;">Interview with {{interview.application?.candidate?.name}}</h3>
              <p style="color: var(--text-muted); font-size: 14px;"><strong>📅</strong> {{interview.interviewDate}} at {{interview.interviewTime}} | <strong>Mode:</strong> {{interview.mode}}</p>
            </div>
            <div *ngIf="interview.status === 'SCHEDULED'">
              <a [href]="getSafeLink(interview.meetingLink)" target="_blank" class="btn-outline" style="text-decoration:none; margin-right:8px;">Join Meeting</a>
              <button class="btn-primary" (click)="openFeedbackModal(interview)">Submit Feedback</button>
            </div>
            <span class="badge badge-success" *ngIf="interview.status === 'COMPLETED'">Completed & Evaluated</span>
          </div>

          <!-- Feedback Modal Inline -->
          <div *ngIf="feedbackInterviewId === interview.id" class="mt-4 form-box animate-in">
            <h4 class="mb-4">Candidate Evaluation Dashboard</h4>
            <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()">
              <div class="form-grid">
                <div class="form-group"><label>Technical Rating (1-10)</label><input type="number" max="10" min="1" class="form-control" formControlName="technicalRating"></div>
                <div class="form-group"><label>Communication Rating (1-10)</label><input type="number" max="10" min="1" class="form-control" formControlName="communicationRating"></div>
                <div class="form-group"><label>Problem Solving (1-10)</label><input type="number" max="10" min="1" class="form-control" formControlName="problemSolvingRating"></div>
                <div class="form-group">
                  <label>Final Recommendation</label>
                  <select class="form-control" formControlName="recommendation">
                    <option value="SELECTED">Select</option>
                    <option value="REJECTED">Reject</option>
                    <option value="HOLD">Hold</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Overall Assessment</label>
                <textarea rows="3" class="form-control" formControlName="overallAssessment"></textarea>
              </div>
              <div style="display: flex; gap: 10px;">
                <button type="submit" class="btn-primary" [disabled]="feedbackForm.invalid">Submit Evaluation</button>
                <button type="button" class="btn-outline" (click)="feedbackInterviewId = null">Cancel</button>
              </div>
            </form>
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
    .form-box { background: rgba(0,0,0,0.2); border: 1px solid var(--primary); border-radius: 12px; padding: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
  `]
})
export class InterviewerDashboardComponent implements OnInit {
  activeTab = 'JOB_INVITATIONS';
  profile: any = null;
  invitations: any[] = [];
  applications: any[] = [];
  interviews: any[] = [];
  
  scheduleAppId: number | null = null;
  scheduleForm: FormGroup;

  feedbackInterviewId: number | null = null;
  feedbackForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.scheduleForm = this.fb.group({
      interviewDate: ['', Validators.required],
      interviewTime: ['', Validators.required],
      mode: ['Online', Validators.required],
      meetingLink: ['', Validators.required]
    });

    this.feedbackForm = this.fb.group({
      technicalRating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      communicationRating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      problemSolvingRating: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      overallAssessment: ['', Validators.required],
      recommendation: ['SELECTED', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProfile();
    this.loadInvitations();
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

  loadProfile() {
    this.dataService.getProfile('interviewer').subscribe(res => this.profile = res);
  }

  loadInvitations() {
    this.dataService.getMyInvitations().subscribe(res => this.invitations = res);
  }

  respondToInvite(invitationId: number, accept: boolean) {
    this.dataService.respondToInvitation(invitationId, accept).subscribe(res => {
      alert(accept ? 'Invitation Accepted!' : 'Invitation Declined.');
      this.loadInvitations();
      if (accept) {
        // Automatically assigned to job, so we might have new candidates
        this.loadApplications();
      }
    });
  }

  loadApplications() {
    this.dataService.getAssignedApplications().subscribe(res => this.applications = res);
  }

  loadInterviews() {
    this.dataService.getInterviewerInterviews().subscribe(res => this.interviews = res);
  }

  openScheduleModal(app: any) {
    this.scheduleAppId = app.id;
    this.scheduleForm.reset({ mode: 'Online' });
  }

  scheduleInterview() {
    if (this.scheduleForm.valid && this.scheduleAppId) {
      this.dataService.scheduleInterview(this.scheduleAppId, this.scheduleForm.value).subscribe(res => {
        alert('Interview Scheduled and Invite Sent!');
        this.scheduleAppId = null;
        this.loadApplications();
        this.loadInterviews();
      });
    }
  }

  openFeedbackModal(interview: any) {
    this.feedbackInterviewId = interview.id;
    this.feedbackForm.reset({ recommendation: 'SELECTED' });
  }

  submitFeedback() {
    if (this.feedbackForm.valid && this.feedbackInterviewId) {
      this.dataService.submitFeedback(this.feedbackInterviewId, this.feedbackForm.value).subscribe(res => {
        alert('Candidate evaluation submitted successfully!');
        this.feedbackInterviewId = null;
        this.loadInterviews();
        this.loadApplications(); // Updates status in the other tab too
      });
    }
  }
}
