import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('x-token');
  const router = inject(Router);
  if (token) return true;
  else {
    router.navigate(['/tabs/tab1']);
    return false;
  }
}