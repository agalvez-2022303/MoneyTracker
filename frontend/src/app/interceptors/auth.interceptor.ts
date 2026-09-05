import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, map, of, switchMap, throwError } from 'rxjs';

const RUTAS_SIN_RETRY = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'];

let refrescando: Observable<boolean> | null = null;

function refrescarSesion(http: HttpClient): Observable<boolean> {
  if (!refrescando) {
    refrescando = http.post<{ ok: boolean }>('/api/auth/refresh', {}).pipe(
      map(() => true),
      catchError(() => of(false)),
      finalize(() => {
        refrescando = null;
      }),
    );
  }
  return refrescando;
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const http = inject(HttpClient);

  if (RUTAS_SIN_RETRY.some((ruta) => req.url.includes(ruta))) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      return refrescarSesion(http).pipe(
        switchMap((ok) => (ok ? next(req) : throwError(() => error))),
      );
    }),
  );
};