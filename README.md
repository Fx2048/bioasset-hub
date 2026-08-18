# Bioasset Keeper

Quiero desarrollar un MVP web llamado BIOASSET para el curso Proyectos de Ingeniería 2.

IMPORTANTE:

El proyecto debe limitarse EXCLUSIVAMENTE a la gestión de equipos biomédicos.

NO incluir gestión de pacientes, trazabilidad de pacientes, FlowTwin, historias clínicas, farmacia, enfermería, telemedicina, diagnóstico por IA ni otros módulos ajenos a equipos biomédicos.

OBJETIVO DEL SISTEMA

BIOASSET es un sistema para centralizar y gestionar la información de equipos biomédicos de una institución de salud.

El sistema debe cubrir únicamente tres funciones principales:

1. INVENTARIO

2. TRAZABILIDAD DE EQUIPOS

3. MANTENIMIENTO DE EQUIPOS

El objetivo es que el personal autorizado pueda saber:

- Qué equipos biomédicos existen.

- Dónde se encuentra cada equipo.

- Cuál es su estado actual.

- Cuál es su historial de movimientos.

- Cuándo recibió mantenimiento.

- Cuándo corresponde realizar el siguiente mantenimiento.

- Qué equipos tienen mantenimiento próximo o vencido.

ALCANCE DEL MVP

Crear una aplicación web responsive con un dashboard administrativo.

ROLES

Implementar inicialmente dos roles:

ADMINISTRADOR:

- Gestionar equipos.

- Gestionar ubicaciones.

- Registrar movimientos.

- Registrar mantenimientos.

- Consultar reportes.

TÉCNICO:

- Consultar equipos.

- Registrar movimientos.

- Registrar mantenimientos.

- Consultar historial de los equipos.

MÓDULO 1 — INVENTARIO

Crear una pantalla "Equipos biomédicos" con una tabla que muestre:

- Código patrimonial

- Nombre del equipo

- Categoría

- Marca

- Modelo

- Número de serie

- Ubicación actual

- Estado

- Fecha de adquisición

- Próximo mantenimiento

Permitir:

- Registrar equipo.

- Editar equipo.

- Consultar detalle.

- Buscar por código, nombre, marca o número de serie.

- Filtrar por categoría.

- Filtrar por estado.

- Filtrar por ubicación.

Estados posibles:

- Operativo

- En mantenimiento

- Fuera de servicio

- De baja

Cada equipo debe tener una página de detalle.

DETALLE DEL EQUIPO

Mostrar:

- Información general.

- Identificación.

- Ubicación actual.

- Estado.

- Fecha de adquisición.

- Historial de movimientos.

- Historial de mantenimientos.

- Próximo mantenimiento.

MÓDULO 2 — TRAZABILIDAD

Cada equipo debe tener un historial de movimientos.

Registrar:

- Equipo.

- Ubicación de origen.

- Ubicación de destino.

- Fecha y hora.

- Usuario responsable.

- Motivo del traslado.

- Observaciones.

La ubicación actual del equipo debe actualizarse automáticamente después de registrar un traslado.

En el detalle del equipo debe mostrarse una línea de tiempo con sus movimientos.

Ejemplo:

Ecógrafo BIO-001

→ Consultorio 2

→ Laboratorio de mantenimiento

→ Consultorio 4

No implementar rastreo GPS ni seguimiento de personas.

La trazabilidad se refiere EXCLUSIVAMENTE al movimiento de equipos biomédicos.

MÓDULO 3 — MANTENIMIENTO

Crear un módulo para registrar y consultar mantenimientos.

Cada registro debe contener:

- Equipo.

- Tipo de mantenimiento:

  - Preventivo

  - Correctivo

- Fecha.

- Técnico responsable.

- Descripción del trabajo realizado.

- Resultado.

- Observaciones.

- Próxima fecha de mantenimiento.

Mostrar el historial de mantenimiento de cada equipo.

Permitir programar el próximo mantenimiento.

ALERTAS

Implementar alertas sencillas relacionadas EXCLUSIVAMENTE con mantenimiento.

Mostrar:

- Mantenimientos vencidos.

- Mantenimientos próximos.

- Equipos actualmente en mantenimiento.

- Equipos fuera de servicio.

Ejemplo:

"El equipo BIO-004 tiene mantenimiento preventivo programado para dentro de 7 días."

No implementar inteligencia artificial predictiva en esta primera versión. Las alertas pueden basarse en reglas simples según la fecha del próximo mantenimiento.

DASHBOARD

Crear un dashboard inicial con indicadores:

- Total de equipos.

- Equipos operativos.

- Equipos en mantenimiento.

- Equipos fuera de servicio.

- Mantenimientos próximos.

- Mantenimientos vencidos.

Agregar gráficos sencillos:

- Equipos por estado.

- Equipos por categoría.

- Mantenimientos por mes.

También incluir una tabla de "Próximos mantenimientos".

IDENTIFICACIÓN QR

Cada equipo debe poder tener un código QR asociado a su código de inventario.

El QR debe permitir acceder rápidamente a la ficha del equipo.

Ejemplo:

BIO-001

Al escanear el QR:

→ abrir la ficha del equipo

→ mostrar estado

→ ubicación actual

→ información básica

→ historial de mantenimiento

No utilizar RFID en el MVP. El QR es suficiente para esta primera versión.

UBICACIONES

Crear un catálogo de ubicaciones.

Ejemplos:

- Consultorio 1

- Consultorio 2

- Consultorio 3

- Laboratorio

- Almacén

- Área de mantenimiento

Permitir que el administrador agregue, edite y desactive ubicaciones.

BASE DE DATOS

Diseñar una base de datos relacional.

Tablas principales:

users

equipment

locations

movements

maintenance_records

Relaciones:

equipment → locations

equipment → movements

equipment → maintenance_records

users → movements

users → maintenance_records

Garantizar integridad referencial.

SEGURIDAD

Implementar autenticación.

Las operaciones de creación, edición y eliminación deben requerir autenticación.

Registrar qué usuario realizó cada movimiento y mantenimiento.

No eliminar físicamente registros importantes de trazabilidad o mantenimiento. Preferir estados como "activo/inactivo" cuando corresponda.

INTERFAZ

La interfaz debe ser profesional, limpia y apropiada para una institución de salud.

Usar:

- Sidebar para navegación.

- Dashboard.

- Tablas con búsqueda y filtros.

- Formularios claros.

- Tarjetas de indicadores.

- Estados mediante badges.

- Modal de confirmación antes de acciones importantes.

- Diseño responsive.

Navegación:

Dashboard

Equipos

Trazabilidad

Mantenimiento

Ubicaciones

Alertas

Usuarios

IMPORTANTE SOBRE EL DESARROLLO

No agregues funcionalidades que no hayan sido solicitadas.

Primero construye una versión funcional del MVP con datos de prueba realistas.

Incluye al menos 20 equipos biomédicos ficticios para poder probar el sistema.

Ejemplos:

- Ecógrafo

- Monitor multiparámetro

- Electrocardiógrafo

- Desfibrilador

- Bomba de infusión

- Oxímetro

- Ventilador mecánico

Los datos deben ser ficticios y no contener información personal real de pacientes.

El sistema debe estar preparado para posteriormente conectarse a datos reales, pero por ahora utilizar datos de demostración.

OBJETIVO FINAL

Quiero obtener un MVP funcional de BIOASSET que permita demostrar claramente:

REGISTRAR EQUIPO

        ↓

IDENTIFICAR EQUIPO

        ↓

CONOCER SU UBICACIÓN

        ↓

REGISTRAR MOVIMIENTOS

        ↓

REGISTRAR MANTENIMIENTO

        ↓

PROGRAMAR PRÓXIMO MANTENIMIENTO

        ↓

GENERAR ALERTA

Este MVP será utilizado como prototipo académico para Proyectos de Ingeniería 2 y debe ser viable de desarrollar y validar antes de noviembre de 2026.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bioasset-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c4127e3f-bd21-4f2e-9188-d198b8b798c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
