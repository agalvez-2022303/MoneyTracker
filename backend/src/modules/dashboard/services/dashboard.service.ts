import * as cuentasService from '../../cuentas/services/cuentas.service';
import * as metasService from '../../metas/services/metas.service';
import * as transaccionesService from '../../transacciones/services/transacciones.service';
import * as transaccionModel from '../../transacciones/models/transaccion.model';

export interface Dashboard {
  dineroTotal: number;
  totalAhorrado: number;
  ingresoMes: number;
  gastoMes: number;
  cuentas: cuentasService.CuentaPublica[];
  metas: metasService.MetaPublica[];
  ultimasTransacciones: transaccionesService.TransaccionPublica[];
}

export async function obtenerDashboard(usuarioId: number): Promise<Dashboard> {
  const [cuentas, metas, ultimasTransacciones, resumenMes] = await Promise.all([
    cuentasService.listar(usuarioId),
    metasService.listar(usuarioId),
    transaccionesService.listar(usuarioId, { limit: 10 }),
    transaccionModel.sumMesPorTipo(usuarioId),
  ]);

  return {
    dineroTotal: cuentas.reduce((acc, cuenta) => acc + cuenta.montoActual, 0),
    totalAhorrado: metas.reduce((acc, meta) => acc + meta.montoActual, 0),
    ingresoMes: resumenMes.ingreso,
    gastoMes: resumenMes.egreso,
    cuentas,
    metas,
    ultimasTransacciones,
  };
}