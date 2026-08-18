import { createFileRoute, Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, ArrowRight, Pencil, Route as RouteIcon, Wrench } from "lucide-react";
import { AppShell } from "@/components/bioasset/AppShell";
import {
  EquipmentDialog,
  MaintenanceDialog,
  MovementDialog,
} from "@/components/bioasset/dialogs";
import { DueBadge, StatusBadge } from "@/components/bioasset/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { daysUntil, formatDate, formatDateTime, useBio } from "@/lib/bioasset/store";

export const Route = createFileRoute("/equipos/$id")({
  head: () => ({
    meta: [
      { title: "Ficha del equipo | BIOASSET" },
      {
        name: "description",
        content:
          "Ficha del equipo biomédico: estado, ubicación actual, historial de movimientos y mantenimientos.",
      },
      { property: "og:title", content: "Ficha del equipo | BIOASSET" },
      { property: "og:description", content: "Detalle e historial del equipo biomédico." },
    ],
  }),
  component: DetalleEquipo,
});

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function DetalleEquipo() {
  const { id } = Route.useParams();
  const { db, equipmentById, locationName, userName, isAdmin } = useBio();
  const equipo = equipmentById(id);

  if (!equipo) {
    return (
      <AppShell title="Equipo no encontrado">
        <p className="text-muted-foreground">El equipo solicitado no existe.</p>
        <Button asChild variant="outline">
          <Link to="/equipos">Volver a equipos</Link>
        </Button>
      </AppShell>
    );
  }

  const movimientos = db.movements
    .filter((m) => m.equipoId === equipo.id)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const mantenimientos = db.maintenance
    .filter((m) => m.equipoId === equipo.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const qrUrl =
    typeof window !== "undefined" ? `${window.location.origin}/equipos/${equipo.id}` : "";

  return (
    <AppShell
      title={`${equipo.codigo} — ${equipo.nombre}`}
      description="Ficha completa del equipo biomédico"
      actions={
        <div className="flex gap-2">
          <MovementDialog
            equipoId={equipo.id}
            trigger={
              <Button size="sm" variant="outline">
                <RouteIcon className="size-4" /> Movimiento
              </Button>
            }
          />
          <MaintenanceDialog
            equipoId={equipo.id}
            trigger={
              <Button size="sm" variant="outline">
                <Wrench className="size-4" /> Mantenimiento
              </Button>
            }
          />
          {isAdmin && (
            <EquipmentDialog
              equipment={equipo}
              trigger={
                <Button size="sm">
                  <Pencil className="size-4" /> Editar
                </Button>
              }
            />
          )}
        </div>
      }
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to="/equipos">
          <ArrowLeft className="size-4" /> Volver al inventario
        </Link>
      </Button>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Información general</CardTitle></CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-3">
            <Field label="Código patrimonial" value={equipo.codigo} />
            <Field label="Nombre" value={equipo.nombre} />
            <Field label="Categoría" value={equipo.categoria} />
            <Field label="Marca" value={equipo.marca} />
            <Field label="Modelo" value={equipo.modelo} />
            <Field label="Número de serie" value={equipo.serie} />
            <Field label="Ubicación actual" value={locationName(equipo.ubicacionId)} />
            <Field label="Estado" value={<StatusBadge status={equipo.estado} />} />
            <Field label="Fecha de adquisición" value={formatDate(equipo.fechaAdquisicion)} />
            <Field
              label="Próximo mantenimiento"
              value={
                <span className="flex items-center gap-2">
                  {formatDate(equipo.proximoMantenimiento)}
                  <DueBadge days={daysUntil(equipo.proximoMantenimiento)} />
                </span>
              }
            />
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader><CardTitle className="text-base">Identificación QR</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-lg border bg-card p-3">
              <QRCodeSVG value={qrUrl || equipo.codigo} size={140} />
            </div>
            <p className="text-sm font-semibold">{equipo.codigo}</p>
            <p className="text-xs text-muted-foreground">
              Escanee el código para abrir esta ficha con estado, ubicación e historial.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="text-base">Historial de movimientos</CardTitle></CardHeader>
        <CardContent>
          <ol className="relative space-y-6 border-l pl-6">
            {movimientos.map((m) => (
              <li key={m.id} className="relative">
                <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary ring-4 ring-background" />
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {m.origenId ? locationName(m.origenId) : "Ingreso"}
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                  {locationName(m.destinoId)}
                  <Badge variant="secondary">{m.motivo}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(m.fecha)} · Responsable: {userName(m.usuarioId)}
                </p>
                {m.observaciones && (
                  <p className="mt-1 text-sm text-muted-foreground">{m.observaciones}</p>
                )}
              </li>
            ))}
            {movimientos.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin movimientos registrados.</p>
            )}
          </ol>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="text-base">Historial de mantenimientos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {mantenimientos.map((m, i) => (
            <div key={m.id}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={m.tipo === "Correctivo" ? "destructive" : "secondary"}>
                  {m.tipo}
                </Badge>
                <span className="text-sm font-medium">{formatDate(m.fecha)}</span>
                <span className="text-xs text-muted-foreground">
                  Técnico: {userName(m.tecnicoId)} · Resultado: {m.resultado}
                </span>
              </div>
              <p className="mt-1 text-sm">{m.descripcion}</p>
              {m.observaciones && (
                <p className="text-sm text-muted-foreground">{m.observaciones}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Próximo mantenimiento programado: {formatDate(m.proximaFecha)}
              </p>
            </div>
          ))}
          {mantenimientos.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin mantenimientos registrados.</p>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
