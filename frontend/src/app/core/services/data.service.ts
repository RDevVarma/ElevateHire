import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiJobs = 'http://localhost:8080/api/jobs';
  private apiApps = 'http://localhost:8080/api/applications';
  private apiInterviews = 'http://localhost:8080/api/interviews';
  private apiProfile = 'http://localhost:8080/api/profile';
  private apiInvitations = 'http://localhost:8080/api/invitations';

  constructor(private http: HttpClient) { }

  // Job APIs
  getActiveJobs(): Observable<any> { return this.http.get(`${this.apiJobs}/active`); }
  getOrgJobs(): Observable<any> { return this.http.get(`${this.apiJobs}/org`); }
  createJob(jobData: any): Observable<any> { return this.http.post(this.apiJobs, jobData); }
  markJobCompleted(jobId: number): Observable<any> { return this.http.patch(`${this.apiJobs}/${jobId}/complete`, {}); }
  deleteJob(jobId: number): Observable<any> { return this.http.delete(`${this.apiJobs}/${jobId}`); }

  // Invitation APIs
  searchInterviewers(skill: string): Observable<any> { return this.http.get(`${this.apiInvitations}/search-interviewers?skill=${skill}`); }
  sendJobInvitation(jobId: number, interviewerUserId: number): Observable<any> { return this.http.post(`${this.apiInvitations}/send?jobId=${jobId}&interviewerUserId=${interviewerUserId}`, {}); }
  getJobInvitationsSent(jobId: number): Observable<any> { return this.http.get(`${this.apiInvitations}/job/${jobId}`); }
  getMyInvitations(): Observable<any> { return this.http.get(`${this.apiInvitations}/my-invites`); }
  respondToInvitation(invitationId: number, accept: boolean): Observable<any> { return this.http.post(`${this.apiInvitations}/${invitationId}/respond?accept=${accept}`, {}); }

  // Application APIs
  applyForJob(jobId: number): Observable<any> { return this.http.post(`${this.apiApps}/apply/${jobId}`, {}); }
  getMyApplications(): Observable<any> { return this.http.get(`${this.apiApps}/my-applications`); }
  getJobApplications(jobId: number): Observable<any> { return this.http.get(`${this.apiApps}/job/${jobId}`); }
  getAssignedApplications(): Observable<any> { return this.http.get(`${this.apiApps}/assigned`); }
  updateAppStatus(appId: number, status: string): Observable<any> { return this.http.patch(`${this.apiApps}/${appId}/status?status=${status}`, {}); }

  // Interview APIs
  scheduleInterview(appId: number, data: any): Observable<any> { return this.http.post(`${this.apiInterviews}/schedule/${appId}`, data); }
  getInterviewerInterviews(): Observable<any> { return this.http.get(`${this.apiInterviews}/my-interviews`); }
  getCandidateInterviews(): Observable<any> { return this.http.get(`${this.apiInterviews}/candidate`); }
  getAppInterviews(appId: number): Observable<any> { return this.http.get(`${this.apiInterviews}/application/${appId}`); }
  getOrgInterviews(): Observable<any> { return this.http.get(`${this.apiInterviews}/org`); }
  submitFeedback(interviewId: number, data: any): Observable<any> { return this.http.post(`${this.apiInterviews}/${interviewId}/feedback`, data); }

  // Profile APIs
  getProfile(rolePath: string): Observable<any> { return this.http.get(`${this.apiProfile}/${rolePath}`); }
  updateProfile(rolePath: string, data: any): Observable<any> { return this.http.put(`${this.apiProfile}/${rolePath}`, data); }
  getInterviewerById(id: number): Observable<any> { return this.http.get(`${this.apiProfile}/interviewer/${id}`); }
}
