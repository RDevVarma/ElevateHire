import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/shared/landing-page.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { OrgDashboardComponent } from './components/dashboards/org-dashboard.component';
import { InterviewerDashboardComponent } from './components/dashboards/interviewer-dashboard.component';
import { CandidateDashboardComponent } from './components/dashboards/candidate-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'org/dashboard', component: OrgDashboardComponent, canActivate: [authGuard], data: { role: 'ORG' } },
  { path: 'interviewer/dashboard', component: InterviewerDashboardComponent, canActivate: [authGuard], data: { role: 'INTERVIEWER' } },
  { path: 'candidate/dashboard', component: CandidateDashboardComponent, canActivate: [authGuard], data: { role: 'CANDIDATE' } }
];
