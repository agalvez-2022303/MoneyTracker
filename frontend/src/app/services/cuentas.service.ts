import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import type { CuentaResumen } from './dashboard.service';

export type TipoCuenta = 'efectivo' | 'tarjeta' | 'cripto' | 'otro';

export interface CrearCuentaDatos {
  nombre: string;
  tipo: TipoCuenta;
  descripcion: string | null;
  monto_inicial: number;
}

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private readonly http = inject(HttpClient);

  crear(datos: CrearCuentaDatos): Observable<CuentaResumen> {
    return this.http.post<{ cuenta: CuentaResumen }>('/api/cuentas', datos).pipe(map((r) => r.cuenta));
  }
}