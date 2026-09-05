import * as cuentasService from '../../cuentas/services/cuentas.service';
import * as metasService from '../../metas/services/metas.service';
import * as transaccionesService from '../../transacciones/services/transacciones.service';

export interface Dashboard {
  dineroTotal: number;
  totalAhorrado: number;
  cuentas: cuentasService.CuentaPublica[];
  metas: metasService.MetaPublica[];
  ultimasTransacciones: transaccionesService.TransaccionPublica[];
}

export async function obtenerDashboard(usuarioId: number): Promise<Dashboard> {
  const [cuentas, metas, ultimasTransacciones] = await Promise.all([
    cuentasService.listar(usuarioId),
    metasService.listar(usuarioId),
    transaccionesService.listar(usuarioId, { limit: 10 }),
  ]);

  return {
    dineroTotal: cuentas.reduce((acc, cuenta) => acc + cuenta.montoActual, 0),
    totalAhorrado: metas.reduce((acc, meta) => acc + meta.montoActual, 0),
    cuentas,
    metas,
    ultimasTransacciones,
  };
}