import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = r"c:\Users\user\Documents\Fisiomedi\web\docs\generated_diagrams"
os.makedirs(out_dir, exist_ok=True)

# 1. ORGANIGRAMA DEL PROYECTO
fig, ax = plt.subplots(figsize=(11, 6.5), dpi=300)
ax.set_xlim(0, 11)
ax.set_ylim(0, 6.5)
ax.axis("off")

ax.text(5.5, 6.1, "ESTRUCTURA ORGANIZACIONAL DEL PROYECTO - FISIOMEDI", 
        fontsize=12, fontweight="bold", ha="center", va="center", color="#0f172a")
ax.text(5.5, 5.75, "Equipo de Consultoría y Desarrollo Tecnológico (EFSRT II - CIBERTEC)", 
        fontsize=8.5, style="italic", ha="center", va="center", color="#475569")

def draw_role_box(x, y, w, h, role, name, color="#1e3a8a", bg="#eff6ff"):
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.08", facecolor=bg, edgecolor=color, lw=1.3)
    ax.add_patch(box)
    hdr = patches.Rectangle((x, y + h - 0.38), w, 0.38, facecolor=color, edgecolor=color)
    ax.add_patch(hdr)
    ax.text(x + w/2, y + h - 0.19, role, fontsize=7.5, fontweight="bold", color="white", ha="center", va="center")
    ax.text(x + w/2, y + (h - 0.38)/2, name, fontsize=7, color="#1e293b", ha="center", va="center")

# Jefe de Proyecto (Top)
draw_role_box(3.8, 4.4, 3.4, 0.95, "Jefe de Proyecto & Arquitecto de Software", "Pedro Fernández Lores\n(Coord. General, Next.js & Neon BD)")

# 2 Key Specialist Roles below
draw_role_box(1.2, 2.5, 3.8, 0.95, "Analista de Negocio & Diseñadora Frontend", "Jennifer Milagros Raquel Alarcón Calixto\n(Requerimientos RUP & Portal Paciente)", "#2563eb", "#f0fdf4")
draw_role_box(6.0, 2.5, 3.8, 0.95, "Ingeniero de Backend, QA & Seguridad", "Emilio Josué Solis Fernández\n(Server Actions, Cifrado PBKDF2 & Pruebas)", "#2563eb", "#f0fdf4")

# External Advisors below
draw_role_box(1.8, 0.8, 3.4, 0.9, "Asesor Metodológico y Docente", "Prof. Jean Carlos Laurente Chacon\n(Docente Supervisor CIBERTEC)", "#475569", "#f8fafc")
draw_role_box(5.8, 0.8, 3.4, 0.9, "Stakeholder / Dirección Clínica", "Lic. Fisioterapia FISIOMEDI\n(Validación de Procesos Médicos)", "#475569", "#f8fafc")

# Connecting lines
ax.plot([5.5, 5.5], [4.4, 3.8], color="#334155", lw=1.2)
ax.plot([3.1, 7.9], [3.8, 3.8], color="#334155", lw=1.2)

ax.plot([3.1, 3.1], [3.8, 3.45], color="#334155", lw=1.2)
ax.plot([7.9, 7.9], [3.8, 3.45], color="#334155", lw=1.2)

ax.plot([5.5, 5.5], [2.5, 2.0], color="#94a3b8", lw=1.2, linestyle="--")
ax.plot([3.5, 7.5], [2.0, 2.0], color="#94a3b8", lw=1.2, linestyle="--")
ax.plot([3.5, 3.5], [2.0, 1.7], color="#94a3b8", lw=1.2, linestyle="--")
ax.plot([7.5, 7.5], [2.0, 1.7], color="#94a3b8", lw=1.2, linestyle="--")

plt.tight_layout()
p_org = os.path.join(out_dir, "organigrama_equipo.png")
plt.savefig(p_org, dpi=300, bbox_inches="tight")
plt.close()
print("Generated organigrama:", p_org)

# 2. CRONOGRAMA DE ACTIVIDADES (DIAGRAMA DE GANTT)
fig, ax = plt.subplots(figsize=(11, 6.5), dpi=300)
ax.set_xlim(0, 16.5)
ax.set_ylim(0, 8.5)
ax.axis("off")

ax.text(8.25, 8.1, "CRONOGRAMA DE ACTIVIDADES DEL PROYECTO (DIAGRAMA DE GANTT)", 
        fontsize=12, fontweight="bold", ha="center", va="center", color="#0f172a")
ax.text(8.25, 7.75, "Distribución de 16 Semanas por Fases Metodológicas de Ingeniería de Software", 
        fontsize=8.5, style="italic", ha="center", va="center", color="#475569")

# Header row: Weeks 1 to 16
ax.text(2.5, 7.2, "Fase / Actividad del Proyecto", fontsize=7.5, fontweight="bold", color="#1e3a8a", va="center")
for w in range(1, 17):
    ax.text(5.0 + (w - 0.5) * 0.7, 7.2, f"S{w}", fontsize=6.8, fontweight="bold", color="#475569", ha="center", va="center")

# Grid lines
for y_idx in range(9):
    y = 7.0 - y_idx * 0.65
    ax.plot([0.5, 16.2], [y, y], color="#e2e8f0", lw=0.7)

for x_idx in range(17):
    x = 5.0 + x_idx * 0.7
    ax.plot([x, x], [7.4, 1.8], color="#e2e8f0", lw=0.7)

tasks = [
    ("Fase 1: Diagnóstico Situacional y SEPTE", 1, 4, "#3b82f6"),
    ("Fase 1: Modelado de Procesos de Negocio RUP", 3, 5, "#60a5fa"),
    ("Fase 2: Diseño de Arquitectura y Base de Datos Neon", 5, 8, "#10b981"),
    ("Fase 2: Definición de Objetivos y Benchmarking", 7, 9, "#34d399"),
    ("Fase 3: Desarrollo Core Web (Next.js & Tailwind)", 9, 13, "#f59e0b"),
    ("Fase 3: Módulo de Resultados y Asignación Médica", 11, 14, "#fbbf24"),
    ("Fase 4: Pruebas Unitarias, QA y Seguridad PBKDF2", 13, 15, "#8b5cf6"),
    ("Fase 4: Despliegue en Cloud Vercel y Documentación", 14, 16, "#ec4899"),
]

for idx, (tname, start, end, color) in enumerate(tasks):
    y = 6.675 - idx * 0.65
    ax.text(0.6, y, tname, fontsize=7, color="#1e293b", va="center")
    
    # Bar
    bx = 5.0 + (start - 1) * 0.7 + 0.05
    bw = (end - start + 1) * 0.7 - 0.1
    bar = patches.FancyBboxPatch((bx, y - 0.18), bw, 0.36, boxstyle="round,pad=0.04", 
                                 facecolor=color, edgecolor="#ffffff", lw=1)
    ax.add_patch(bar)
    ax.text(bx + bw/2, y, f"S{start}-S{end}", fontsize=6.2, fontweight="bold", color="white", ha="center", va="center")

plt.tight_layout()
p_gantt = os.path.join(out_dir, "cronograma_gantt.png")
plt.savefig(p_gantt, dpi=300, bbox_inches="tight")
plt.close()
print("Generated Gantt chart:", p_gantt)
