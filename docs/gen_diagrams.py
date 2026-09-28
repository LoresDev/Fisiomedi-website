import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = r"c:\Users\user\Documents\Fisiomedi\web\docs\generated_diagrams"
os.makedirs(out_dir, exist_ok=True)

# 0. Diagrama de Actores y Casos de Uso del Negocio (CUN)
fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
ax.set_xlim(0, 12)
ax.set_ylim(0, 8)
ax.axis('off')

# Title
ax.text(6, 7.6, 'MODELO DE CASOS DE USO DEL NEGOCIO (CUN) - METODOLOGÍA RUP', 
        fontsize=14, fontweight='bold', ha='center', va='center', color='#1e293b')
ax.text(6, 7.25, 'Sistema Web FisioMedi: Gestión de Citas, Fisioterapeutas y Resultados Diagnósticos', 
        fontsize=10, style='italic', ha='center', va='center', color='#64748b')

# System Boundary Box
rect = patches.FancyBboxPatch((3.5, 0.4), 5.5, 6.4, boxstyle='round,pad=0.2', 
                              linewidth=1.5, edgecolor='#3b82f6', facecolor='#f8fafc', linestyle='--')
ax.add_patch(rect)
ax.text(6.25, 6.6, 'Límite del Negocio: FISIOMEDI', fontsize=11, fontweight='bold', color='#1d4ed8', ha='center')

# Function to draw Actor
def draw_actor(x, y, name, subtitle):
    circle = plt.Circle((x, y + 0.35), 0.18, color='#0284c7', ec='#0369a1', lw=1.5)
    ax.add_patch(circle)
    ax.plot([x, x], [y + 0.17, y - 0.25], color='#0369a1', lw=2)
    ax.plot([x - 0.25, x + 0.25], [y + 0.05, y + 0.05], color='#0369a1', lw=2)
    ax.plot([x, x - 0.2], [y - 0.25, y - 0.6], color='#0369a1', lw=2)
    ax.plot([x, x + 0.2], [y - 0.25, y - 0.6], color='#0369a1', lw=2)
    ax.text(x, y - 0.85, name, fontsize=9.5, fontweight='bold', ha='center', color='#0f172a')
    ax.text(x, y - 1.1, subtitle, fontsize=7.5, ha='center', color='#64748b')

draw_actor(1.8, 5.5, 'Paciente', '(Cliente del Centro)')
draw_actor(1.8, 2.2, 'Recepcionista\n/ Administrador', '(Personal Administrativo)')
draw_actor(10.5, 3.8, 'Fisioterapeuta\n/ Médico', '(Profesional Clínico)')

def draw_use_case(x, y, code, title, w=4.4, h=0.75):
    oval = patches.Ellipse((x, y), w, h, edgecolor='#2563eb', facecolor='#eff6ff', lw=1.5)
    ax.add_patch(oval)
    ax.text(x, y + 0.12, code, fontsize=8.5, fontweight='bold', color='#1e40af', ha='center', va='center')
    ax.text(x, y - 0.14, title, fontsize=8, color='#1e293b', ha='center', va='center')

cuns = [
    (6.25, 5.8, 'CUN-01', 'Gestión y Reserva de Citas (Web / Presencial)'),
    (6.25, 4.8, 'CUN-02', 'Asignación de Fisioterapeuta Especialista'),
    (6.25, 3.8, 'CUN-03', 'Atención e Ingreso de Resultados (Resonancia/Rayos X)'),
    (6.25, 2.8, 'CUN-04', 'Consulta y Descarga de Resultados (Portal Paciente)'),
    (6.25, 1.8, 'CUN-05', 'Mantenimiento de Fichas e Historias Clínicas'),
    (6.25, 0.8, 'CUN-06', 'Control de Acceso y Gestión de Usuarios/Roles'),
]

for x, y, code, title in cuns:
    draw_use_case(x, y, code, title)

def connect(p1, p2, color='#475569', style='-'):
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=color, lw=1.2, linestyle=style)

connect((2.3, 5.5), (4.1, 5.8)) # CUN-01
connect((2.3, 5.3), (4.1, 2.8)) # CUN-04

connect((2.3, 2.5), (4.1, 5.7)) # CUN-01
connect((2.3, 2.3), (4.1, 4.8)) # CUN-02
connect((2.3, 2.0), (4.1, 1.8)) # CUN-05
connect((2.3, 1.8), (4.1, 0.8)) # CUN-06

connect((9.8, 4.0), (8.4, 4.8)) # CUN-02
connect((9.8, 3.8), (8.4, 3.8)) # CUN-03
connect((9.8, 3.5), (8.4, 1.8)) # CUN-05

plt.tight_layout()
out_path_cun = os.path.join(out_dir, 'diagrama_actores_cun.png')
plt.savefig(out_path_cun, dpi=300, bbox_inches='tight')
plt.close()
print('Generated CUN diagram:', out_path_cun)

# 1. Diagrama de Actividades RUP (Swimlane)
fig, ax = plt.subplots(figsize=(13, 11), dpi=300)
ax.set_xlim(0, 13)
ax.set_ylim(0, 11)
ax.axis("off")

# Title
ax.text(6.5, 10.6, "DIAGRAMA DE ACTIVIDADES RUP: PROCESO INTEGRAL DE CITAS Y RESULTADOS", 
        fontsize=13, fontweight="bold", ha="center", va="center", color="#0f172a")
ax.text(6.5, 10.3, "Carriles de Responsabilidad (Swimlanes): Paciente - Recepción - Fisioterapeuta - Sistema Web", 
        fontsize=9.5, style="italic", ha="center", va="center", color="#475569")

# Draw 4 swimlanes
lanes = [
    ("Paciente", 0.4, 3.1, "#eff6ff", "#3b82f6"),
    ("Recepción / Admin", 3.5, 3.1, "#f0fdf4", "#22c55e"),
    ("Fisioterapeuta / Médico", 6.6, 3.1, "#fefce8", "#eab308"),
    ("Sistema Web FisioMedi", 9.7, 2.9, "#f8fafc", "#64748b")
]

for name, x, w, bg, border in lanes:
    hdr = patches.Rectangle((x, 9.6), w, 0.5, facecolor=border, edgecolor="#334155", lw=1)
    ax.add_patch(hdr)
    ax.text(x + w/2, 9.85, name, fontsize=9.5, fontweight="bold", color="white", ha="center", va="center")
    body = patches.Rectangle((x, 0.4), w, 9.2, facecolor=bg, edgecolor="#94a3b8", lw=0.8, alpha=0.5)
    ax.add_patch(body)

def draw_activity(x, y, w, h, text, color="#2563eb", bg="#ffffff"):
    box = patches.FancyBboxPatch((x - w/2, y - h/2), w, h, boxstyle="round,pad=0.15",
                                 facecolor=bg, edgecolor=color, lw=1.3)
    ax.add_patch(box)
    ax.text(x, y, text, fontsize=7.5, ha="center", va="center", color="#1e293b", multialignment="center")

init_circle = plt.Circle((1.95, 9.2), 0.12, facecolor="#0f172a", ec="#0f172a")
ax.add_patch(init_circle)
ax.text(1.95, 9.42, "Inicio", fontsize=7.5, fontweight="bold", ha="center")

draw_activity(1.95, 8.4, 2.6, 0.65, "Solicita cita vía Web\no acude presencialmente")
draw_activity(1.95, 7.3, 2.6, 0.65, "Selecciona servicio,\nfecha, hora y especialista")
draw_activity(1.95, 3.7, 2.6, 0.65, "Asiste a la sesión\nde fisioterapia programada")
draw_activity(1.95, 1.3, 2.6, 0.65, "Ingresa a 'Mi Cuenta'\ny descarga sus resultados")

draw_activity(5.05, 7.3, 2.6, 0.65, "Registra cita interna\no valida reserva web")
draw_activity(5.05, 5.9, 2.6, 0.65, "Confirma cita y asigna\nmédico / fisioterapeuta")

draw_activity(8.15, 4.8, 2.6, 0.65, "Revisa citas asignadas\ny prepara sesión clínica")
draw_activity(8.15, 3.7, 2.6, 0.65, "Ejecuta terapia y evalúa\nestudios (resonancia, etc.)")
draw_activity(8.15, 2.5, 2.6, 0.65, "Ingresa resultados diagnósticos\ny adjunta PDF / imágenes")

draw_activity(11.15, 8.4, 2.4, 0.65, "Verifica turnos libres\nen base de datos")
draw_activity(11.15, 6.6, 2.4, 0.65, "Crea registro de cita\nen estado Pendiente")
draw_activity(11.15, 5.9, 2.4, 0.65, "Actualiza estado a Confirmada\ny vincula especialista")
draw_activity(11.15, 2.5, 2.4, 0.65, "Guarda archivo en storage,\nvalida y completa cita")
draw_activity(11.15, 1.3, 2.4, 0.65, "Habilita visualización de\nexámenes en portal paciente")

fin_outer = plt.Circle((1.95, 0.65), 0.14, facecolor="none", ec="#0f172a", lw=1.5)
fin_inner = plt.Circle((1.95, 0.65), 0.08, facecolor="#0f172a", ec="#0f172a")
ax.add_patch(fin_outer)
ax.add_patch(fin_inner)
ax.text(1.95, 0.42, "Fin", fontsize=7.5, fontweight="bold", ha="center")

def arrow(x1, y1, x2, y2, color="#334155"):
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="->", lw=1.2, color=color, shrinkA=3, shrinkB=3))

arrow(1.95, 9.08, 1.95, 8.73)
arrow(3.25, 8.4, 9.95, 8.4)
arrow(11.15, 8.07, 11.15, 6.93)
arrow(9.95, 6.6, 3.25, 7.3)
arrow(1.95, 6.97, 1.95, 4.03)
arrow(3.25, 7.3, 3.75, 7.3)
arrow(5.05, 6.97, 5.05, 6.23)
arrow(6.35, 5.9, 9.95, 5.9)
arrow(11.15, 5.57, 8.15, 5.13)
arrow(8.15, 4.47, 8.15, 4.03)
arrow(6.85, 3.7, 3.25, 3.7)
arrow(8.15, 3.37, 8.15, 2.83)
arrow(9.45, 2.5, 9.95, 2.5)
arrow(11.15, 2.17, 11.15, 1.63)
arrow(9.95, 1.3, 3.25, 1.3)
arrow(1.95, 0.97, 1.95, 0.79)

plt.tight_layout()
out_path_act = os.path.join(out_dir, "diagrama_actividades_rup.png")
plt.savefig(out_path_act, dpi=300, bbox_inches="tight")
plt.close()
print("Generated activities diagram:", out_path_act)

# 2. Diagrama de Arquitectura Tecnológica del Software
fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
ax.set_xlim(0, 12)
ax.set_ylim(0, 7.5)
ax.axis("off")

ax.text(6, 7.1, "ARQUITECTURA TECNOLÓGICA DEL SISTEMA WEB FISIOMEDI", 
        fontsize=13, fontweight="bold", ha="center", va="center", color="#0f172a")
ax.text(6, 6.75, "Arquitectura Moderna en Capas: Cliente Web, Next.js Server Components, PostgreSQL Neon y Storage", 
        fontsize=9.5, style="italic", ha="center", va="center", color="#475569")

capa1 = patches.FancyBboxPatch((0.5, 0.8), 2.8, 5.5, boxstyle="round,pad=0.2", 
                               facecolor="#eff6ff", edgecolor="#3b82f6", lw=1.5)
ax.add_patch(capa1)
ax.text(1.9, 5.9, "Capa de Presentación\n(Frontend / Clientes)", fontsize=10, fontweight="bold", color="#1e40af", ha="center")

def mini_box(x, y, w, h, title, desc, bg="#ffffff", border="#93c5fd"):
    b = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1", facecolor=bg, edgecolor=border, lw=1)
    ax.add_patch(b)
    ax.text(x + w/2, y + h*0.65, title, fontsize=8, fontweight="bold", ha="center", color="#1e293b")
    ax.text(x + w/2, y + h*0.25, desc, fontsize=7, ha="center", color="#64748b")

mini_box(0.8, 4.4, 2.2, 0.9, "Portal Paciente Web", "Reserva online / Mis Resultados")
mini_box(0.8, 3.1, 2.2, 0.9, "Panel Administrativo", "Gestión Citas / Pacientes / Staff")
mini_box(0.8, 1.8, 2.2, 0.9, "Dispositivos Móviles / PC", "Diseño Responsive (Tailwind)")

capa2 = patches.FancyBboxPatch((4.2, 0.8), 3.6, 5.5, boxstyle="round,pad=0.2", 
                               facecolor="#f0fdf4", edgecolor="#22c55e", lw=1.5)
ax.add_patch(capa2)
ax.text(6.0, 5.9, "Capa de Aplicación y Lógica\n(Next.js 16 + Vercel Cloud)", fontsize=10, fontweight="bold", color="#15803d", ha="center")

mini_box(4.5, 4.4, 3.0, 0.9, "React Server Components", "Renderizado veloz en servidor (SSR)", bg="#ffffff", border="#86efac")
mini_box(4.5, 3.1, 3.0, 0.9, "Next.js Server Actions", "Lógica de negocio & transacciones", bg="#ffffff", border="#86efac")
mini_box(4.5, 1.8, 3.0, 0.9, "Autenticación & Seguridad", "Sesiones HTTP-only / PBKDF2 Salt", bg="#ffffff", border="#86efac")

capa3 = patches.FancyBboxPatch((8.7, 0.8), 2.8, 5.5, boxstyle="round,pad=0.2", 
                               facecolor="#fefce8", edgecolor="#eab308", lw=1.5)
ax.add_patch(capa3)
ax.text(10.1, 5.9, "Capa de Datos y Archivos\n(PostgreSQL + Storage)", fontsize=10, fontweight="bold", color="#a16207", ha="center")

mini_box(9.0, 4.4, 2.2, 0.9, "Neon PostgreSQL", "Tablas relacionales serverless", bg="#ffffff", border="#fde047")
mini_box(9.0, 3.1, 2.2, 0.9, "Almacenamiento Exámenes", "PDFs de Resonancias / Rayos X", bg="#ffffff", border="#fde047")
mini_box(9.0, 1.8, 2.2, 0.9, "Pooling & Conexiones", "PgBouncer seguro SSL", bg="#ffffff", border="#fde047")

ax.annotate("", xy=(4.2, 4.85), xytext=(3.3, 4.85),
            arrowprops=dict(arrowstyle="<->", lw=1.5, color="#2563eb"))
ax.annotate("", xy=(4.2, 3.55), xytext=(3.3, 3.55),
            arrowprops=dict(arrowstyle="<->", lw=1.5, color="#2563eb"))
ax.annotate("", xy=(4.2, 2.25), xytext=(3.3, 2.25),
            arrowprops=dict(arrowstyle="<->", lw=1.5, color="#2563eb"))

ax.annotate("", xy=(8.7, 4.85), xytext=(7.8, 4.85),
            arrowprops=dict(arrowstyle="<->", lw=1.5, color="#16a34a"))
ax.annotate("", xy=(8.7, 3.55), xytext=(7.8, 3.55),
            arrowprops=dict(arrowstyle="<->", lw=1.5, color="#16a34a"))
ax.annotate("", xy=(8.7, 2.25), xytext=(7.8, 2.25),
            arrowprops=dict(arrowstyle="<->", lw=1.5, color="#16a34a"))

plt.tight_layout()
out_path_arch = os.path.join(out_dir, "diagrama_arquitectura_web.png")
plt.savefig(out_path_arch, dpi=300, bbox_inches="tight")
plt.close()
print("Generated architecture diagram:", out_path_arch)

# 3. Diagrama Entidad-Relación (Base de Datos PostgreSQL)
fig, ax = plt.subplots(figsize=(13, 8.5), dpi=300)
ax.set_xlim(0, 13)
ax.set_ylim(0, 8.5)
ax.axis("off")

ax.text(6.5, 8.1, "DIAGRAMA ENTIDAD-RELACIÓN (POSTGRESQL NEON) - FISIOMEDI", 
        fontsize=13, fontweight="bold", ha="center", va="center", color="#0f172a")
ax.text(6.5, 7.75, "Modelo Relacional de Base de Datos para Citas, Pacientes, Exámenes y Usuarios", 
        fontsize=9.5, style="italic", ha="center", va="center", color="#475569")

def draw_table(x, y, w, h, table_name, pk, fields, fks=[]):
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08", facecolor="#ffffff", edgecolor="#1e293b", lw=1.3)
    ax.add_patch(box)
    hdr = patches.Rectangle((x, y + h - 0.5), w, 0.5, facecolor="#1e3a8a", edgecolor="#1e293b", lw=1)
    ax.add_patch(hdr)
    ax.text(x + w/2, y + h - 0.25, table_name, fontsize=8.5, fontweight="bold", color="white", ha="center", va="center")
    
    ax.text(x + 0.2, y + h - 0.75, f"[PK] {pk}", fontsize=7.5, fontweight="bold", color="#b91c1c")
    
    curr_y = y + h - 1.0
    for f in fields:
        ax.text(x + 0.2, curr_y, f, fontsize=7, color="#334155")
        curr_y -= 0.25
        
    for fk in fks:
        ax.text(x + 0.2, curr_y, f"[FK] {fk}", fontsize=7, fontweight="bold", color="#0369a1")
        curr_y -= 0.25

draw_table(0.6, 3.8, 3.2, 3.5, "PATIENTS (Pacientes)", "id: UUID", [
    "name: TEXT", "doc_id: TEXT (DNI)", "phone: TEXT", "email: TEXT",
    "birth_date: TEXT", "gender: TEXT", "address: TEXT", "notes: TEXT",
    "created_at: TIMESTAMPTZ"
])

draw_table(4.7, 4.3, 3.4, 3.0, "USERS (Usuarios / Staff)", "id: UUID", [
    "username: TEXT (DNI/login)", "name: TEXT", "role: TEXT (admin/terapeuta)",
    "must_change_password: BOOL", "pass_salt: TEXT", "pass_hash: TEXT",
    "created_at: TIMESTAMPTZ"
], ["patient_id: UUID -> PATIENTS"])

draw_table(9.0, 3.4, 3.5, 3.9, "APPOINTMENTS (Citas)", "id: UUID", [
    "name: TEXT", "phone: TEXT", "email: TEXT", "service_id: TEXT",
    "service_name: TEXT", "date: TEXT", "time: TEXT", "notes: TEXT",
    "status: TEXT (pendiente/confirmada...)", "source: TEXT (web/interno)",
    "therapist_name: TEXT", "created_at: TIMESTAMPTZ"
], ["patient_id: UUID -> PATIENTS", "therapist_id: UUID -> USERS"])

draw_table(0.6, 0.4, 3.6, 3.0, "EXAMS (Resultados Médicos)", "id: UUID", [
    "title: TEXT", "exam_date: TEXT", "notes: TEXT", "file_name: TEXT",
    "original_name: TEXT", "mime_type: TEXT", "size: INT", "created_by: TEXT",
    "status: TEXT (validado)", "validated_by: TEXT", "validated_at: TIMESTAMPTZ"
], ["patient_id: UUID -> PATIENTS", "appointment_id: UUID -> APPOINTMENTS"])

draw_table(5.2, 0.7, 3.2, 2.5, "HISTORY_ENTRIES (Historial)", "id: UUID", [
    "date: TEXT", "professional: TEXT", "reason: TEXT", "diagnosis: TEXT",
    "treatment: TEXT", "created_at: TIMESTAMPTZ"
], ["patient_id: UUID -> PATIENTS"])

def rel_arrow(p1, p2):
    ax.annotate("", xy=p2, xytext=p1,
                arrowprops=dict(arrowstyle="->", lw=1.2, color="#2563eb", shrinkA=2, shrinkB=2))

rel_arrow((3.8, 5.5), (4.7, 5.5))
rel_arrow((3.8, 6.0), (9.0, 6.0))
rel_arrow((4.7, 5.0), (9.0, 5.0))
rel_arrow((2.2, 3.8), (2.2, 3.4))
rel_arrow((9.0, 3.5), (4.2, 2.0))
rel_arrow((3.8, 4.2), (5.2, 2.0))

plt.tight_layout()
out_path_er = os.path.join(out_dir, "diagrama_bd_er.png")
plt.savefig(out_path_er, dpi=300, bbox_inches="tight")
plt.close()
print("Generated ER diagram:", out_path_er)
