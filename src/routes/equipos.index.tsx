import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/bioasset/AppShell";
import { EquipmentDialog } from "@/components/bioasset/dialogs";
import { DueBadge, StatusBadge } from "@/components/bioasset/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { daysUntil, formatDate, useBio } from "@/lib/bioasset/store";
import { CATEGORIES, EQUIPMENT_STATUSES } from "@/lib/bioasset/types";

export const Route = createFileRoute("/equipos/")({
  head: () => ({
    meta: [
      { title: "Equipos biomédicos | BIOASSET" },
      {
        name: "description",
        content: "Inventario de equipos biomédicos con búsqueda y filtros por categoría, estado y ubicación.",
      },
      { property: "og:title", content: "Equipos biomédicos | BIOASSET" },
      { property: "og:description", content: "Inventario de equipos biomédicos." },
    ],
  }),
  component: EquiposPage,
});

function EquiposPage() {
  const { db, isAdmin, locationName } = useBio();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todas");
  const [est, setEst] = useState("todos");
  const [ubi, setUbi] = useState("todas");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return db.equipment.filter((e) => {
      const match =
        !term ||
        [e.codigo, e.nombre, e.marca, e.serie].some((v) => v.toLowerCase().includes(term));
      return (
        match &&
        (cat === "todas" || e.categoria === cat) &&
        (est === "todos" || e.estado === est) &&
        (ubi === "todas" || e.ubicacionId === ubi)
      );
    });
  }, [db.equipment, q, cat, est, ubi]);

  return (
    <AppShell
      title="Equipos biomédicos"
      description={`${rows.length} equipos encontrados`}
      actions={
        isAdmin ? (
          <EquipmentDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" /> Registrar equipo
              </Button>
            }
          />
        ) : null
      }
    >
      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="grid gap-3 py-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por código, nombre, marca o serie"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las categorías</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={est} onValueChange={setEst}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {EQUIPMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ubi} onValueChange={setUbi}>
            <SelectTrigger><SelectValue placeholder="Ubicación" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las ubicaciones</SelectItem>
              {db.locations.map((l) => (
                <SelectItem key={l.id} value={l.id}>{l.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="overflow-x-auto py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>N.° de serie</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Adquisición</TableHead>
                <TableHead>Próx. mantenimiento</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.codigo}</TableCell>
                  <TableCell>{e.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{e.categoria}</TableCell>
                  <TableCell>{e.marca}</TableCell>
                  <TableCell className="text-muted-foreground">{e.modelo}</TableCell>
                  <TableCell className="text-muted-foreground">{e.serie}</TableCell>
                  <TableCell>{locationName(e.ubicacionId)}</TableCell>
                  <TableCell><StatusBadge status={e.estado} /></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(e.fechaAdquisicion)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(e.proximoMantenimiento)}{" "}
                    <DueBadge days={daysUntil(e.proximoMantenimiento)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/equipos/$id" params={{ id: e.id }}>Ver detalle</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="py-10 text-center text-muted-foreground">
                    No se encontraron equipos con los filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
