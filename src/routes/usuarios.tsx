import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/bioasset/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuarios | BIOASSET" },
      {
        name: "description",
        content: "Usuarios del sistema con roles de administrador y técnico biomédico.",
      },
      { property: "og:title", content: "Usuarios | BIOASSET" },
      { property: "og:description", content: "Roles y accesos del personal autorizado." },
    ],
  }),
  component: UsuariosPage,
});

function UsuariosPage() {
  const { db, isAdmin, toggleUser, user } = useBio();

  return (
    <AppShell title="Usuarios" description="Personal autorizado del sistema">
      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="overflow-x-auto py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Movimientos</TableHead>
                <TableHead>Mantenimientos</TableHead>
                <TableHead>Estado</TableHead>
                {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {db.users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="capitalize">{u.rol}</TableCell>
                  <TableCell>{db.movements.filter((m) => m.usuarioId === u.id).length}</TableCell>
                  <TableCell>{db.maintenance.filter((m) => m.tecnicoId === u.id).length}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        u.activo
                          ? "border-success/30 bg-success/15 text-success"
                          : "border-border bg-muted text-muted-foreground"
                      }
                    >
                      {u.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={u.id === user?.id}>
                            {u.activo ? "Desactivar" : "Activar"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar cambio</AlertDialogTitle>
                            <AlertDialogDescription>
                              Se cambiará el estado de acceso de {u.nombre}. Los registros
                              históricos se conservan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                toggleUser(u.id);
                                toast.success("Usuario actualizado");
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
