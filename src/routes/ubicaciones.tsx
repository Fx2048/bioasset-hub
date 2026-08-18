import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/bioasset/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBio } from "@/lib/bioasset/store";
import type { Location } from "@/lib/bioasset/types";

export const Route = createFileRoute("/ubicaciones")({
  head: () => ({
    meta: [
      { title: "Ubicaciones | BIOASSET" },
      {
        name: "description",
        content: "Catálogo de ubicaciones donde se encuentran los equipos biomédicos.",
      },
      { property: "og:title", content: "Ubicaciones | BIOASSET" },
      { property: "og:description", content: "Catálogo de áreas y servicios de la institución." },
    ],
  }),
  component: UbicacionesPage,
});

function LocationDialog({ location, trigger }: { location?: Location; trigger: React.ReactNode }) {
  const { saveLocation } = useBio();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(location?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(location?.descripcion ?? "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{location ? "Editar ubicación" : "Nueva ubicación"}</DialogTitle>
          <DialogDescription>Áreas o servicios donde pueden estar los equipos.</DialogDescription>
        </DialogHeader>
        <form
          id="loc-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveLocation({
              id: location?.id,
              nombre,
              descripcion,
              activo: location?.activo ?? true,
            });
            toast.success(location ? "Ubicación actualizada" : "Ubicación creada");
            setOpen(false);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="nom">Nombre</Label>
            <Input id="nom" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Descripción</Label>
            <Input id="desc" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit" form="loc-form">Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UbicacionesPage() {
  const { db, isAdmin, toggleLocation } = useBio();

  return (
    <AppShell
      title="Ubicaciones"
      description="Catálogo de áreas y servicios"
      actions={
        isAdmin ? (
          <LocationDialog
            trigger={
              <Button size="sm">
                <Plus className="size-4" /> Nueva ubicación
              </Button>
            }
          />
        ) : null
      }
    >
      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="overflow-x-auto py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ubicación</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Equipos asignados</TableHead>
                <TableHead>Estado</TableHead>
                {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {db.locations.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{l.descripcion}</TableCell>
                  <TableCell>{db.equipment.filter((e) => e.ubicacionId === l.id).length}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        l.activo
                          ? "border-success/30 bg-success/15 text-success"
                          : "border-border bg-muted text-muted-foreground"
                      }
                    >
                      {l.activo ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="space-x-2 text-right">
                      <LocationDialog
                        location={l}
                        trigger={<Button variant="outline" size="sm">Editar</Button>}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {l.activo ? "Desactivar" : "Activar"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar cambio</AlertDialogTitle>
                            <AlertDialogDescription>
                              {l.activo
                                ? `La ubicación ${l.nombre} dejará de estar disponible para nuevos traslados.`
                                : `La ubicación ${l.nombre} volverá a estar disponible.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                toggleLocation(l.id);
                                toast.success("Ubicación actualizada");
                              }}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
