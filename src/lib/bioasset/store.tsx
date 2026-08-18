import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildSeed } from "./seed";
import type {
  DB,
  Equipment,
  Location,
  MaintenanceRecord,
  Movement,
  User,
} from "./types";

const DB_KEY = "bioasset.db.v1";
const SESSION_KEY = "bioasset.session.v1";

interface Ctx {
  ready: boolean;
  db: DB;
  user: User | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  isAdmin: boolean;
  addEquipment: (e: Omit<Equipment, "id" | "activo">) => void;
  updateEquipment: (id: string, patch: Partial<Equipment>) => void;
  addMovement: (m: Omit<Movement, "id" | "usuarioId">) => void;
  addMaintenance: (m: Omit<MaintenanceRecord, "id">) => void;
  saveLocation: (l: Omit<Location, "id"> & { id?: string | undefined }) => void;
  toggleLocation: (id: string) => void;
  toggleUser: (id: string) => void;
  locationName: (id: string | null) => string;
  userName: (id: string) => string;
  equipmentById: (id: string) => Equipment | undefined;
}

const BioContext = createContext<Ctx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function BioAssetProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => buildSeed());
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) setDb(JSON.parse(raw) as DB);
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setUserId(s);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }, [db, ready]);

  const user = useMemo(
    () => db.users.find((u) => u.id === userId && u.activo) ?? null,
    [db.users, userId],
  );

  const login = useCallback(
    (email: string, password: string) => {
      const found = db.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!found) return "Usuario no encontrado";
      if (!found.activo) return "El usuario está inactivo";
      if (password !== "bioasset") return "Contraseña incorrecta";
      setUserId(found.id);
      localStorage.setItem(SESSION_KEY, found.id);
      return null;
    },
    [db.users],
  );

  const logout = useCallback(() => {
    setUserId(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const value: Ctx = {
    ready,
    db,
    user,
    login,
    logout,
    isAdmin: user?.rol === "administrador",
    addEquipment: (e) =>
      setDb((d) => {
        const id = uid();
        return {
          ...d,
          equipment: [...d.equipment, { ...e, id, activo: true }],
          movements: [
            ...d.movements,
            {
              id: uid(),
              equipoId: id,
              origenId: null,
              destinoId: e.ubicacionId,
              fecha: new Date().toISOString(),
              usuarioId: userId ?? "u1",
              motivo: "Ingreso al inventario",
              observaciones: "Registro inicial del equipo.",
            },
          ],
        };
      }),
    updateEquipment: (id, patch) =>
      setDb((d) => ({
        ...d,
        equipment: d.equipment.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      })),
    addMovement: (m) =>
      setDb((d) => ({
        ...d,
        movements: [...d.movements, { ...m, id: uid(), usuarioId: userId ?? "u1" }],
        equipment: d.equipment.map((e) =>
          e.id === m.equipoId ? { ...e, ubicacionId: m.destinoId } : e,
        ),
      })),
    addMaintenance: (m) =>
      setDb((d) => ({
        ...d,
        maintenance: [...d.maintenance, { ...m, id: uid() }],
        equipment: d.equipment.map((e) =>
          e.id === m.equipoId ? { ...e, proximoMantenimiento: m.proximaFecha } : e,
        ),
      })),
    saveLocation: (l) =>
      setDb((d) =>
        l.id
          ? {
              ...d,
              locations: d.locations.map((x) =>
                x.id === l.id ? { ...x, ...l, id: x.id } : x,
              ),
            }
          : { ...d, locations: [...d.locations, { ...l, id: uid() }] },
      ),
    toggleLocation: (id) =>
      setDb((d) => ({
        ...d,
        locations: d.locations.map((l) => (l.id === id ? { ...l, activo: !l.activo } : l)),
      })),
    toggleUser: (id) =>
      setDb((d) => ({
        ...d,
        users: d.users.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)),
      })),
    locationName: (id) => db.locations.find((l) => l.id === id)?.nombre ?? "—",
    userName: (id) => db.users.find((u) => u.id === id)?.nombre ?? "—",
    equipmentById: (id) => db.equipment.find((e) => e.id === id),
  };

  return <BioContext.Provider value={value}>{children}</BioContext.Provider>;
}

export function useBio() {
  const ctx = useContext(BioContext);
  if (!ctx) throw new Error("useBio debe usarse dentro de BioAssetProvider");
  return ctx;
}

export function daysUntil(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86400000);
}

export function formatDate(value: string) {
  const d = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value: string) {
  const d = new Date(value);
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
