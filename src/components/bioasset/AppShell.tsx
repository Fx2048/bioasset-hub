import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Boxes,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Route as RouteIcon,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBio } from "@/lib/bioasset/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/equipos", label: "Equipos", icon: Boxes },
  { to: "/trazabilidad", label: "Trazabilidad", icon: RouteIcon },
  { to: "/mantenimiento", label: "Mantenimiento", icon: Wrench },
  { to: "/ubicaciones", label: "Ubicaciones", icon: MapPin },
  { to: "/alertas", label: "Alertas", icon: AlertTriangle },
  { to: "/usuarios", label: "Usuarios", icon: Users },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active && "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-6 py-6">
      <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Activity className="size-5" />
      </div>
      <div>
        <p className="text-base font-bold tracking-tight text-sidebar-foreground">BIOASSET</p>
        <p className="text-xs text-sidebar-foreground/60">Equipos biomédicos</p>
      </div>
    </div>
  );
}

function LoginScreen() {
  const { login } = useBio();
  const [email, setEmail] = useState("admin@bioasset.pe");
  const [password, setPassword] = useState("bioasset");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-[var(--shadow-card)]">
        <CardHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="size-6" />
          </div>
          <CardTitle className="text-2xl">BIOASSET</CardTitle>
          <CardDescription>
            Gestión de inventario, trazabilidad y mantenimiento de equipos biomédicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(login(email, password));
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Correo institucional</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
          </form>
          <div className="mt-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Cuentas de demostración</p>
            <p>Administrador: admin@bioasset.pe</p>
            <p>Técnico: tecnico@bioasset.pe</p>
            <p>Contraseña: bioasset</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { ready, user, logout } = useBio();
  const [open, setOpen] = useState(false);

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!user) return <LoginScreen />;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <Brand />
        <NavList />
        <div className="mt-auto border-t border-sidebar-border p-4">
          <p className="text-sm font-medium text-sidebar-foreground">{user.nombre}</p>
          <p className="mb-3 text-xs capitalize text-sidebar-foreground/60">{user.rol}</p>
          <Button variant="secondary" size="sm" className="w-full" onClick={logout}>
            <LogOut className="size-4" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
              <SheetTitle className="sr-only">Navegación</SheetTitle>
              <Brand />
              <NavList onNavigate={() => setOpen(false)} />
              <div className="mt-6 px-3">
                <Button variant="secondary" size="sm" className="w-full" onClick={logout}>
                  <LogOut className="size-4" /> Cerrar sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions}
        </header>
        <main className="flex-1 space-y-6 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
