import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBio } from "@/lib/bioasset/store";
import { CATEGORIES, EQUIPMENT_STATUSES, type Equipment } from "@/lib/bioasset/types";

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

export function EquipmentDialog({
  equipment,
  trigger,
}: {
  equipment?: Equipment;
  trigger: ReactNode;
}) {
  const { db, addEquipment, updateEquipment } = useBio();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const activeLocations = db.locations.filter((l) => l.activo);
  const [form, setForm] = useState({
    codigo: equipment?.codigo ?? `BIO-${String(db.equipment.length + 1).padStart(3, "0")}`,
    nombre: equipment?.nombre ?? "",
    categoria: equipment?.categoria ?? CATEGORIES[0],
    marca: equipment?.marca ?? "",
    modelo: equipment?.modelo ?? "",
    serie: equipment?.serie ?? "",
    ubicacionId: equipment?.ubicacionId ?? activeLocations[0]?.id ?? "",
    estado: equipment?.estado ?? "Operativo",
    fechaAdquisicion: equipment?.fechaAdquisicion ?? today(),
    proximoMantenimiento: equipment?.proximoMantenimiento ?? inDays(180),
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (equipment) {
      updateEquipment(equipment.id, form as Partial<Equipment>);
      toast.success(`Equipo ${form.codigo} actualizado`);
    } else {
      addEquipment(form as Omit<Equipment, "id" | "activo">);
      toast.success(`Equipo ${form.codigo} registrado`);
    }
    setConfirm(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{equipment ? "Editar equipo" : "Registrar equipo"}</DialogTitle>
            <DialogDescription>
              Complete la información del equipo biomédico.
            </DialogDescription>
          </DialogHeader>
          <form
            id="equipment-form"
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setConfirm(true);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="codigo">Código patrimonial</Label>
              <Input id="codigo" value={form.codigo} onChange={(e) => set("codigo", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del equipo</Label>
              <Input id="nombre" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={(v) => set("estado", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" value={form.marca} onChange={(e) => set("marca", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" value={form.modelo} onChange={(e) => set("modelo", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serie">Número de serie</Label>
              <Input id="serie" value={form.serie} onChange={(e) => set("serie", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Ubicación actual</Label>
              <Select value={form.ubicacionId} onValueChange={(v) => set("ubicacionId", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {activeLocations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adq">Fecha de adquisición</Label>
              <Input id="adq" type="date" value={form.fechaAdquisicion} onChange={(e) => set("fechaAdquisicion", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prox">Próximo mantenimiento</Label>
              <Input id="prox" type="date" value={form.proximoMantenimiento} onChange={(e) => set("proximoMantenimiento", e.target.value)} required />
            </div>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" form="equipment-form">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar registro</AlertDialogTitle>
            <AlertDialogDescription>
              Se guardará la información del equipo {form.codigo} — {form.nombre}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={save}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MovementDialog({
  equipoId,
  trigger,
}: {
  equipoId?: string;
  trigger: ReactNode;
}) {
  const { db, addMovement, equipmentById } = useBio();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({
    equipoId: equipoId ?? db.equipment[0]?.id ?? "",
    destinoId: "",
    motivo: "",
    observaciones: "",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const equipo = equipmentById(form.equipoId);

  const save = () => {
    if (!equipo || !form.destinoId) return;
    addMovement({
      equipoId: form.equipoId,
      origenId: equipo.ubicacionId,
      destinoId: form.destinoId,
      fecha: new Date().toISOString(),
      motivo: form.motivo,
      observaciones: form.observaciones,
    });
    toast.success("Traslado registrado y ubicación actualizada");
    setConfirm(false);
    setOpen(false);
    setForm((f) => ({ ...f, destinoId: "", motivo: "", observaciones: "" }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar movimiento</DialogTitle>
            <DialogDescription>
              La ubicación actual del equipo se actualizará automáticamente.
            </DialogDescription>
          </DialogHeader>
          <form
            id="movement-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setConfirm(true);
            }}
          >
            <div className="space-y-2">
              <Label>Equipo</Label>
              <Select value={form.equipoId} onValueChange={(v) => set("equipoId", v)} disabled={!!equipoId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {db.equipment.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.codigo} — {e.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ubicación de origen</Label>
              <Input value={db.locations.find((l) => l.id === equipo?.ubicacionId)?.nombre ?? "—"} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Ubicación de destino</Label>
              <Select value={form.destinoId} onValueChange={(v) => set("destinoId", v)}>
                <SelectTrigger><SelectValue placeholder="Seleccione destino" /></SelectTrigger>
                <SelectContent>
                  {db.locations
                    .filter((l) => l.activo && l.id !== equipo?.ubicacionId)
                    .map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.nombre}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo del traslado</Label>
              <Input id="motivo" value={form.motivo} onChange={(e) => set("motivo", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="obs">Observaciones</Label>
              <Textarea id="obs" value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)} />
            </div>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" form="movement-form" disabled={!form.destinoId}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar traslado</AlertDialogTitle>
            <AlertDialogDescription>
              El equipo {equipo?.codigo} se moverá a{" "}
              {db.locations.find((l) => l.id === form.destinoId)?.nombre}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={save}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function MaintenanceDialog({
  equipoId,
  trigger,
}: {
  equipoId?: string;
  trigger: ReactNode;
}) {
  const { db, addMaintenance, user, updateEquipment } = useBio();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({
    equipoId: equipoId ?? db.equipment[0]?.id ?? "",
    tipo: "Preventivo",
    fecha: today(),
    tecnicoId: user?.id ?? "u2",
    descripcion: "",
    resultado: "Conforme",
    observaciones: "",
    proximaFecha: inDays(180),
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    addMaintenance({
      equipoId: form.equipoId,
      tipo: form.tipo as "Preventivo" | "Correctivo",
      fecha: form.fecha,
      tecnicoId: form.tecnicoId,
      descripcion: form.descripcion,
      resultado: form.resultado,
      observaciones: form.observaciones,
      proximaFecha: form.proximaFecha,
    });
    updateEquipment(form.equipoId, { estado: "Operativo" });
    toast.success("Mantenimiento registrado y próxima fecha programada");
    setConfirm(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar mantenimiento</DialogTitle>
            <DialogDescription>
              Registre el trabajo realizado y programe el próximo mantenimiento.
            </DialogDescription>
          </DialogHeader>
          <form
            id="maintenance-form"
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setConfirm(true);
            }}
          >
            <div className="space-y-2 sm:col-span-2">
              <Label>Equipo</Label>
              <Select value={form.equipoId} onValueChange={(v) => set("equipoId", v)} disabled={!!equipoId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {db.equipment.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.codigo} — {e.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de mantenimiento</Label>
              <Select value={form.tipo} onValueChange={(v) => set("tipo", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventivo">Preventivo</SelectItem>
                  <SelectItem value="Correctivo">Correctivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" type="date" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Técnico responsable</Label>
              <Select value={form.tecnicoId} onValueChange={(v) => set("tecnicoId", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {db.users.filter((u) => u.activo).map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="res">Resultado</Label>
              <Input id="res" value={form.resultado} onChange={(e) => set("resultado", e.target.value)} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="desc">Descripción del trabajo realizado</Label>
              <Textarea id="desc" value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="mobs">Observaciones</Label>
              <Textarea id="mobs" value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prox2">Próxima fecha de mantenimiento</Label>
              <Input id="prox2" type="date" value={form.proximaFecha} onChange={(e) => set("proximaFecha", e.target.value)} required />
            </div>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" form="maintenance-form">Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar mantenimiento</AlertDialogTitle>
            <AlertDialogDescription>
              Se registrará el mantenimiento y se programará el próximo para el{" "}
              {form.proximaFecha}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={save}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
