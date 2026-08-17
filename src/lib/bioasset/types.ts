export type Role = "administrador" | "tecnico";

export type EquipmentStatus =
  | "Operativo"
  | "En mantenimiento"
  | "Fuera de servicio"
  | "De baja";

export const EQUIPMENT_STATUSES: EquipmentStatus[] = [
  "Operativo",
  "En mantenimiento",
  "Fuera de servicio",
  "De baja",
];

export const CATEGORIES = [
  "Diagnóstico por imagen",
  "Monitoreo",
  "Soporte vital",
  "Terapia",
  "Laboratorio",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  activo: boolean;
}

export interface Location {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface Equipment {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  marca: string;
  modelo: string;
  serie: string;
  ubicacionId: string;
  estado: EquipmentStatus;
  fechaAdquisicion: string;
  proximoMantenimiento: string;
  activo: boolean;
}

export interface Movement {
  id: string;
  equipoId: string;
  origenId: string | null;
  destinoId: string;
  fecha: string;
  usuarioId: string;
  motivo: string;
  observaciones: string;
}

export type MaintenanceType = "Preventivo" | "Correctivo";

export interface MaintenanceRecord {
  id: string;
  equipoId: string;
  tipo: MaintenanceType;
  fecha: string;
  tecnicoId: string;
  descripcion: string;
  resultado: string;
  observaciones: string;
  proximaFecha: string;
}

export interface DB {
  users: User[];
  locations: Location[];
  equipment: Equipment[];
  movements: Movement[];
  maintenance: MaintenanceRecord[];
}
