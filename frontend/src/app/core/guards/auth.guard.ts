import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const expectedRole = route.data['role'];
    const currentRole = authService.getRole();
    
    if (expectedRole && expectedRole !== currentRole) {
       // redirect based on role
       if(currentRole === 'ORG') router.navigate(['/org/dashboard']);
       else if(currentRole === 'INTERVIEWER') router.navigate(['/interviewer/dashboard']);
       else if(currentRole === 'CANDIDATE') router.navigate(['/candidate/dashboard']);
       return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};
