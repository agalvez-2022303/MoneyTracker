import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type TipoTransaccion = 'ingreso' | 'egreso';

export interface CuentaResumen {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
  montoActual: number;
  createdAt: string;
  updatedAt: string;
}

export interface MetaResumen {
  id: number;
  nombre: string;
  cantidadObjetivo: number;
  montoInicial: number;
  prioridad: string;
  descripcion: string | null;
  icono: string | null;
  fechaLimite: string | null;
  montoActual: number;
  progreso: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransaccionReciente {
  id: number;
  nombre: string;
  tipo: TipoTransaccion;
  cuentaId: number | null;
  metaId: number | null;
  categoria: string;
  descripcion: string | null;
  montoOriginal: number;
  monedaOriginal: string;
  tasaCambioUsada: number;
  montoGtq: number;
  createdAt: string;
}

export interface DashboardData {
  dineroTotal: number;
  totalAhorrado: number;
  ingresoMes: number;
  gastoMes: number;
  cuentas: CuentaResumen[];
  metas: MetaResumen[];
  ultimasTransacciones: TransaccionReciente[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  obtener(): Observable<DashboardData> {
    return this.http
      .get<{ dashboard: DashboardData }>('/api/dashboard')
      .pipe(map((r) => r.dashboard));
  }
}