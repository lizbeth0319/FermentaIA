import { describe, it, expect } from 'vitest';
import { API } from '../endpoints';

describe('API endpoints helpers', () => {
  it('builds finca endpoints', () => {
    expect(API.fincas.list()).toBe('/api/fincas');
    expect(API.fincas.byId('123')).toBe('/api/fincas/123');
    expect(API.fincas.byProductor('p1')).toBe('/api/fincas/productor/p1');
    expect(API.fincas.create()).toBe('/api/fincas');
    expect(API.fincas.update('99')).toBe('/api/fincas/99');
    expect(API.fincas.remove('77')).toBe('/api/fincas/77');
  });

  it('builds tanque endpoints', () => {
    expect(API.tanques.list()).toBe('/api/tanques');
    expect(API.tanques.byId('t1')).toBe('/api/tanques/t1');
    expect(API.tanques.byFinca('f1')).toBe('/api/tanques/finca/f1');
  });

  it('builds lote endpoints', () => {
    expect(API.lotes.list()).toBe('/api/lotes');
    expect(API.lotes.byId('l1')).toBe('/api/lotes/l1');
    expect(API.lotes.byTanque('t1')).toBe('/api/lotes/tanque/t1');
  });

  it('builds perfiles.buscar with query params', () => {
    expect(API.perfiles.buscar({})).toBe('/api/perfiles/buscar');
    expect(API.perfiles.buscar({ variedad: 'Caturra' })).toBe('/api/perfiles/buscar?variedad=Caturra');
    expect(API.perfiles.buscar({ proceso: 'lavado' })).toBe('/api/perfiles/buscar?proceso=lavado');
    expect(API.perfiles.buscar({ fase: 'fermentacion' })).toBe('/api/perfiles/buscar?fase=fermentacion');
    expect(API.perfiles.buscar({ variedad: 'C', proceso: 'P', fase: 'F' })).toBe('/api/perfiles/buscar?variedad=C&proceso=P&fase=F');
  });
});