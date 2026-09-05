import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import type { TransaccionReciente } from './dashboard.service';

export type TipoTransaccion = 'ingreso' | 'egreso';

export interface CrearTransaccionDatos {
  nombre: string;
  tipo: TipoTransaccion;
  monto_original: number;
  cuenta_id?: number;
  meta_id?: number;
  moneda_original?: string;
  tasa_cambio_usada?: number;
  categoria: string;
  descripcion: string | null;
}

@Injectable({ providedIn: 'root' })
export class TransaccionesService {
  private readonly http = inject(HttpClient);

  crear(datos: CrearTransaccionDatos): Observable<TransaccionReciente> {
    return this.http
      .post<{ transaccion: TransaccionReciente }>('/api/transacciones', datos)
      .pipe(map((r) => r.transaccion));
  }
}