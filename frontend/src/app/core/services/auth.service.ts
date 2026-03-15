import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentRoleSubject = new BehaviorSubject<string | null>(this.getRole());

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
          localStorage.setItem('user_role', res.role);
          this.currentRoleSubject.next(res.role);
        }
      })
    );
  }

  registerCandidate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/candidate`, data);
  }

  registerInterviewer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/interviewer`, data);
  }

  registerOrganization(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/organization`, data);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    this.currentRoleSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
  getCurrentRoleStatus() {
      return this.currentRoleSubject.asObservable();
  }
}
