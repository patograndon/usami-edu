# USAMI EDU — Arquitectura Monorepo

## Estructura de Carpetas

```
usami_edu/
├── apps/
│   ├── web/                          # Dashboard Next.js (existente → se mueve aquí)
│   │   ├── src/
│   │   │   ├── app/                  # Pages (App Router)
│   │   │   ├── components/           # UI Components
│   │   │   ├── context/              # AuthContext, TenantContext
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── types/                # TypeScript types
│   │   │   └── data/                 # Mock data (reemplazado por API en producción)
│   │   ├── package.json
│   │   └── next.config.ts
│   │
│   ├── landing/                      # Landing Page (Next.js estático)
│   │   ├── src/app/
│   │   │   ├── page.tsx              # Hero + Beneficios + Planes + CTA
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   └── package.json
│   │
│   ├── api/                          # Backend NestJS
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/
│   │   │   │   ├── guards/           # TenantGuard, RoleGuard, PermissionGuard
│   │   │   │   ├── decorators/       # @CurrentUser, @TenantId, @RequirePermission
│   │   │   │   ├── interceptors/     # AuditInterceptor, TenantInterceptor
│   │   │   │   └── filters/          # HttpExceptionFilter
│   │   │   ├── modules/
│   │   │   │   ├── auth/             # Login, JWT, refresh tokens
│   │   │   │   ├── tenant/           # CRUD tenants, feature flags
│   │   │   │   ├── user/             # Users, roles, permissions
│   │   │   │   ├── student/          # Alumnos, fichas
│   │   │   │   ├── course/           # Cursos
│   │   │   │   ├── attendance/       # Asistencia + retiro QR
│   │   │   │   ├── security/         # Bitácora ingreso/egreso
│   │   │   │   ├── daily-log/        # Diario de aula
│   │   │   │   ├── evaluation/       # Evaluaciones pedagógicas
│   │   │   │   ├── decreto170/       # D170, FUEI, sesiones especialista
│   │   │   │   ├── calendar/         # Eventos
│   │   │   │   ├── communication/    # Circulares, encuestas
│   │   │   │   ├── notification/     # FCM push engine + templates
│   │   │   │   ├── chat/             # WebSocket mensajería
│   │   │   │   ├── nutrition/        # Menús semanales
│   │   │   │   ├── hr/               # RRHH, asistencia personal
│   │   │   │   ├── finance/          # Recibos, pagos
│   │   │   │   └── audit/            # Logs de auditoría
│   │   │   └── prisma/
│   │   │       └── schema.prisma
│   │   ├── package.json
│   │   └── nest-cli.json
│   │
│   └── mobile/                       # React Native / Expo
│       ├── src/
│       │   ├── screens/
│       │   ├── components/
│       │   └── services/
│       └── package.json
│
├── packages/
│   └── shared/                       # Tipos compartidos, constantes, validaciones
│       ├── src/
│       │   ├── types/                # Interfaces compartidas
│       │   ├── constants/            # Roles, permisos, labels
│       │   └── validation/           # Schemas Zod
│       └── package.json
│
├── package.json                      # Workspace root
├── turbo.json                        # Turborepo config
├── .gitignore
├── ARCHITECTURE.md
└── README.md
```

## Lógica de Feature Flags

```
FeatureConfig (tabla en BD)
  ├── tenantId: string
  ├── moduleKey: string (ej: "decreto170", "chat", "finanzas")
  ├── enabled: boolean
  └── plan: "basico" | "profesional" | "enterprise"

Flujo:
1. TenantGuard valida tenant_id en cada request
2. FeatureFlagGuard verifica si el módulo está habilitado para ese tenant
3. Si no está habilitado → 403 Forbidden
4. Frontend consulta GET /api/tenant/:id/features → oculta/muestra UI
```

## Lógica de Permisos (Profesor → Apoderados de sus alumnos)

```
1. Profesor tiene cursoAsignado (course_id)
2. Al enviar mensaje/notificación:
   - Backend busca alumnos del course_id
   - Obtiene parent_ids vinculados a esos alumnos
   - Valida que el destinatario esté en esa lista
   - Si no → 403 "No autorizado para contactar este apoderado"
3. Director puede contactar a cualquier apoderado (sin restricción)
```
