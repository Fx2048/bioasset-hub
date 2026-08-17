import type { DB, Equipment, MaintenanceRecord, Movement } from "./types";

const day = 86400000;
const iso = (offsetDays: number, hour = 9) => {
  const d = new Date(Date.now() + offsetDays * day);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const dateOnly = (offsetDays: number) => iso(offsetDays).slice(0, 10);

export const seedUsers = [
  {
    id: "u1",
    nombre: "Brigitte Bernal",
    email: "admin@bioasset.pe",
    rol: "administrador" as const,
    activo: true,
  },
  {
    id: "u2",
    nombre: "Carlos Quispe",
    email: "tecnico@bioasset.pe",
    rol: "tecnico" as const,
    activo: true,
  },
  {
    id: "u3",
    nombre: "María Torres",
    email: "maria.torres@bioasset.pe",
    rol: "tecnico" as const,
    activo: true,
  },
  {
    id: "u4",
    nombre: "Luis Ramírez",
    email: "luis.ramirez@bioasset.pe",
    rol: "administrador" as const,
    activo: false,
  },
];

export const seedLocations = [
  { id: "l1", nombre: "Consultorio 1", descripcion: "Medicina general", activo: true },
  { id: "l2", nombre: "Consultorio 2", descripcion: "Ginecología", activo: true },
  { id: "l3", nombre: "Consultorio 3", descripcion: "Cardiología", activo: true },
  { id: "l4", nombre: "Consultorio 4", descripcion: "Pediatría", activo: true },
  { id: "l5", nombre: "Laboratorio", descripcion: "Laboratorio clínico", activo: true },
  { id: "l6", nombre: "Almacén", descripcion: "Almacén de equipos", activo: true },
  { id: "l7", nombre: "Área de mantenimiento", descripcion: "Taller biomédico", activo: true },
  { id: "l8", nombre: "UCI", descripcion: "Unidad de cuidados intensivos", activo: true },
  { id: "l9", nombre: "Emergencia", descripcion: "Tópico de emergencia", activo: true },
  { id: "l10", nombre: "Sala de partos", descripcion: "Fuera de uso temporal", activo: false },
];

type Row = [string, string, string, string, string, string, string, string, number, number];

// nombre, categoria, marca, modelo, serie, ubicacion, estado, adquisicion(daysAgo), proxMant(offset)
const rows: Row[] = [
  ["Ecógrafo", "Diagnóstico por imagen", "Mindray", "DC-70", "SN-EC-1042", "l2", "Operativo", "", -900, 7],
  ["Monitor multiparámetro", "Monitoreo", "Philips", "IntelliVue MX450", "SN-MM-2201", "l8", "Operativo", "", -700, 21],
  ["Electrocardiógrafo", "Diagnóstico por imagen", "GE Healthcare", "MAC 2000", "SN-EK-3310", "l3", "Operativo", "", -540, -5],
  ["Desfibrilador", "Soporte vital", "Zoll", "R Series", "SN-DF-4102", "l9", "Operativo", "", -1100, 45],
  ["Bomba de infusión", "Terapia", "B. Braun", "Infusomat Space", "SN-BI-5501", "l8", "Operativo", "", -420, 3],
  ["Oxímetro de pulso", "Monitoreo", "Nonin", "PalmSAT 2500", "SN-OX-6120", "l1", "Operativo", "", -300, 60],
  ["Ventilador mecánico", "Soporte vital", "Dräger", "Savina 300", "SN-VM-7003", "l8", "En mantenimiento", "", -1300, 14],
  ["Aspirador de secreciones", "Terapia", "Medela", "Vario 18", "SN-AS-8140", "l9", "Operativo", "", -650, 30],
  ["Incubadora neonatal", "Soporte vital", "Atom", "Incu i", "SN-IN-9011", "l4", "Operativo", "", -800, -12],
  ["Rayos X portátil", "Diagnóstico por imagen", "Siemens", "Mobilett Elara", "SN-RX-1055", "l9", "Fuera de servicio", "", -1500, -30],
  ["Electrobisturí", "Terapia", "Valleylab", "Force FX", "SN-EB-1180", "l7", "En mantenimiento", "", -1250, 10],
  ["Centrífuga de laboratorio", "Laboratorio", "Hettich", "EBA 200", "SN-CF-1220", "l5", "Operativo", "", -480, 90],
  ["Microscopio binocular", "Laboratorio", "Olympus", "CX23", "SN-MB-1305", "l5", "Operativo", "", -960, 120],
  ["Analizador hematológico", "Laboratorio", "Sysmex", "XN-550", "SN-AH-1410", "l5", "Operativo", "", -520, 5],
  ["Lámpara quirúrgica", "Terapia", "Skytron", "Aurora", "SN-LQ-1490", "l7", "Operativo", "", -1400, 75],
  ["Nebulizador", "Terapia", "Omron", "NE-C801", "SN-NB-1560", "l1", "Operativo", "", -260, 40],
  ["Tensiómetro digital", "Monitoreo", "Omron", "HEM-7156", "SN-TD-1630", "l1", "Operativo", "", -180, 25],
  ["Cuna de calor radiante", "Soporte vital", "Fanem", "Vision 2186", "SN-CC-1700", "l4", "Operativo", "", -740, -2],
  ["Autoclave", "Laboratorio", "Tuttnauer", "3870 EA", "SN-AU-1780", "l7", "Operativo", "", -1600, 18],
  ["Bomba de jeringa", "Terapia", "Terumo", "TE-SS830", "SN-BJ-1850", "l8", "De baja", "", -2000, 365],
  ["Monitor fetal", "Monitoreo", "Bistos", "BT-350", "SN-MF-1920", "l2", "Operativo", "", -600, 12],
  ["Desfibrilador externo automático", "Soporte vital", "Philips", "HeartStart FRx", "SN-DE-1990", "l6", "Operativo", "", -350, 150],
];

export function buildSeed(): DB {
  const equipment: Equipment[] = rows.map((r, i) => ({
    id: `e${i + 1}`,
    codigo: `BIO-${String(i + 1).padStart(3, "0")}`,
    nombre: r[0],
    categoria: r[1],
    marca: r[2],
    modelo: r[3],
    serie: r[4],
    ubicacionId: r[5],
    estado: r[6] as Equipment["estado"],
    fechaAdquisicion: dateOnly(r[8]),
    proximoMantenimiento: dateOnly(r[9]),
    activo: true,
  }));

  const movements: Movement[] = [];
  const maintenance: MaintenanceRecord[] = [];

  equipment.forEach((e, i) => {
    movements.push({
      id: `m-${e.id}-1`,
      equipoId: e.id,
      origenId: null,
      destinoId: "l6",
      fecha: iso(-200 - i * 3, 8),
      usuarioId: "u1",
      motivo: "Ingreso al inventario",
      observaciones: "Registro inicial del equipo en almacén.",
    });
    movements.push({
      id: `m-${e.id}-2`,
      equipoId: e.id,
      origenId: "l6",
      destinoId: e.ubicacionId,
      fecha: iso(-60 - i * 2, 11),
      usuarioId: i % 2 === 0 ? "u2" : "u3",
      motivo: "Asignación a servicio",
      observaciones: "Traslado a su área operativa.",
    });

    maintenance.push({
      id: `mt-${e.id}-1`,
      equipoId: e.id,
      tipo: i % 3 === 0 ? "Correctivo" : "Preventivo",
      fecha: dateOnly(-90 - i),
      tecnicoId: i % 2 === 0 ? "u2" : "u3",
      descripcion:
        i % 3 === 0
          ? "Reemplazo de componente defectuoso y pruebas funcionales."
          : "Limpieza interna, calibración y verificación eléctrica.",
      resultado: i % 3 === 0 ? "Reparado" : "Conforme",
      observaciones: "Equipo entregado al servicio en condiciones operativas.",
      proximaFecha: e.proximoMantenimiento,
    });
  });

  return { users: seedUsers, locations: seedLocations, equipment, movements, maintenance };
}
