import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const soloAutenticadosGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService)
    .verificarSesion()
    .pipe(map((ok) => (ok ? true : router.createUrlTree(['/login']))));
};

export const soloInvitadosGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService)
    .verificarSesion()
    .pipe(map((ok) => (ok ? router.createUrlTree(['/dashboard']) : true)));
};