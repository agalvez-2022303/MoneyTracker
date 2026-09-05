import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import type { MetaResumen } from './dashboard.service';

export type PrioridadMeta = 'alta' | 'media' | 'baja';

export interface CrearMetaDatos {
  nombre: string;
  cantidad_objetivo: number;
  monto_inicial: number;
  prioridad: PrioridadMeta;
  descripcion: string | null;
  icono: string;
  fecha_limite: string;
}

@Injectable({ providedIn: 'root' })
export class MetasService {
  private readonly http = inject(HttpClient);

  crear(datos: CrearMetaDatos): Observable<MetaResumen> {
    return this.http.post<{ meta: MetaResumen }>('/api/metas', datos).pipe(map((r) => r.meta));
  }
}