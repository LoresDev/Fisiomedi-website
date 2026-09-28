import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = r"c:\Users\user\Documents\Fisiomedi\web\docs\generated_diagrams"
os.makedirs(out_dir, exist_ok=True)

def draw_window_frame(ax, x, y, w, h, title):
    frame = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05",
                                   facecolor="#ffffff", edgecolor="#cbd5e1", lw=1.5)
    ax.add_patch(frame)
    tb = patches.Rectangle((x, y + h - 0.45), w, 0.45, facecolor="#f1f5f9", edgecolor="#cbd5e1", lw=1)
    ax.add_patch(tb)
    ax.plot([x + 0.25], [y + h - 0.22], marker='o', markersize=5, color='#ef4444')
    ax.plot([x + 0.45], [y + h - 0.22], marker='o', markersize=5, color='#f59e0b')
    ax.plot([x + 0.65], [y + h - 0.22], marker='o', markersize=5, color='#10b981')
    ax.text(x + w/2, y + h - 0.22, title, fontsize=8, fontweight="bold", color="#475569", ha="center", va="center")

# 1. UI: RESERVAR CITA
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6.5)
ax.axis("off")
draw_window_frame(ax, 0.5, 0.4, 9.0, 5.7, "FisioMedi | Reservar Cita en Linea - https://fisiomedi.pe/reservar")

ax.text(5.0, 5.2, "Reserva tu Cita de Fisioterapia y Rehabilitacion", fontsize=11, fontweight="bold", color="#1e3a8a", ha="center")
ax.text(5.0, 4.9, "Completa el formulario en 4 sencillos pasos para asegurar tu atencion profesional", fontsize=8, color="#64748b", ha="center")

box1 = patches.FancyBboxPatch((0.8, 3.4), 4.0, 1.25, boxstyle="round,pad=0.08", facecolor="#eff6ff", edgecolor="#3b82f6", lw=1.2)
ax.add_patch(box1)
ax.text(1.0, 4.35, "Paso 1: Selecciona el Servicio *", fontsize=8, fontweight="bold", color="#1d4ed8")
ax.text(1.0, 4.05, "(*) Fisioterapia Traumatologica (S/ 70 - 45 min)\n  ( ) Terapia Manual Ortopedica | Rehabilitacion Deportiva\n  ( ) Fisioterapia Neurologica | Terapia del Dolor", fontsize=7, color="#334155")

box2 = patches.FancyBboxPatch((5.2, 3.4), 4.0, 1.25, boxstyle="round,pad=0.08", facecolor="#f0fdf4", edgecolor="#22c55e", lw=1.2)
ax.add_patch(box2)
ax.text(5.4, 4.35, "Paso 2: Especialista de Preferencia", fontsize=8, fontweight="bold", color="#15803d")
ax.text(5.4, 4.05, "(*) Cualquier especialista disponible (Asignacion automatica)\n  ( ) Dr. Pedro Fernandez (Especialista en Columna)\n  ( ) Lic. Jennifer Alarcon (Fisioterapeuta Post-operatorio)\n  ( ) Lic. Emilio Solis (Rehabilitacion Deportiva)", fontsize=7, color="#334155")

box3 = patches.FancyBboxPatch((0.8, 1.9), 4.0, 1.3, boxstyle="round,pad=0.08", facecolor="#fefce8", edgecolor="#eab308", lw=1.2)
ax.add_patch(box3)
ax.text(1.0, 2.9, "Paso 3: Fecha y Turno de Horario", fontsize=8, fontweight="bold", color="#a16207")
ax.text(1.0, 2.6, "Fecha seleccionada: 28/09/2026\nTurnos disponibles:", fontsize=7, color="#334155")
for idx, t in enumerate(["09:00", "10:00", "11:30", "15:00", "16:30"]):
    btn = patches.FancyBboxPatch((1.0 + idx * 0.75, 2.05), 0.65, 0.35, boxstyle="round,pad=0.04", 
                                facecolor="#2563eb" if idx == 1 else "#ffffff", 
                                edgecolor="#2563eb", lw=1)
    ax.add_patch(btn)
    ax.text(1.0 + idx * 0.75 + 0.325, 2.22, t, fontsize=6.5, fontweight="bold", 
            color="#ffffff" if idx == 1 else "#1d4ed8", ha="center", va="center")

box4 = patches.FancyBboxPatch((5.2, 1.9), 4.0, 1.3, boxstyle="round,pad=0.08", facecolor="#ffffff", edgecolor="#cbd5e1", lw=1)
ax.add_patch(box4)
ax.text(5.4, 2.9, "Paso 4: Datos de Contacto", fontsize=8, fontweight="bold", color="#1e293b")
ax.text(5.4, 2.6, "Nombres: Juan Carlos Perez Gomez\nTelefono: +51 987 654 321 | DNI: 71234567\nMotivo: Dolor lumbar cronico tras esfuerzo fisico", fontsize=7, color="#334155")

btn_conf = patches.FancyBboxPatch((3.5, 0.7), 3.0, 0.55, boxstyle="round,pad=0.08", facecolor="#2563eb", edgecolor="#1d4ed8", lw=1.5)
ax.add_patch(btn_conf)
ax.text(5.0, 0.97, "Confirmar y Reservar Cita >>", fontsize=9, fontweight="bold", color="#ffffff", ha="center", va="center")

plt.tight_layout()
p1 = os.path.join(out_dir, "ui_reservar.png")
plt.savefig(p1, dpi=300, bbox_inches="tight")
plt.close()

# 2. UI: PORTAL MI CUENTA (RESULTADOS Y CITAS)
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6.5)
ax.axis("off")
draw_window_frame(ax, 0.5, 0.4, 9.0, 5.7, "FisioMedi | Portal del Paciente - https://fisiomedi.pe/mi-cuenta")

ax.text(0.9, 5.2, "Bienvenido, Juan Carlos Perez Gomez", fontsize=10.5, fontweight="bold", color="#0f172a")
ax.text(0.9, 4.95, "DNI: 71234567 | Paciente Registrado en FisioMedi", fontsize=7.5, color="#64748b")

tabs = [("[1] Proximas Citas (1)", False), ("[2] Mis Resultados (2)", True), ("[3] Mis Datos", False), ("[4] Historial (3)", False)]
for idx, (t, active) in enumerate(tabs):
    tb = patches.FancyBboxPatch((0.9 + idx * 2.1, 4.45), 2.0, 0.38, boxstyle="round,pad=0.05",
                                facecolor="#2563eb" if active else "#f8fafc",
                                edgecolor="#2563eb" if active else "#cbd5e1", lw=1)
    ax.add_patch(tb)
    ax.text(0.9 + idx * 2.1 + 1.0, 4.64, t, fontsize=7, fontweight="bold",
            color="#ffffff" if active else "#475569", ha="center", va="center")

card = patches.FancyBboxPatch((0.9, 1.2), 8.2, 3.0, boxstyle="round,pad=0.08", facecolor="#ffffff", edgecolor="#e2e8f0", lw=1.2)
ax.add_patch(card)
ax.text(1.2, 3.85, "Resultados Medicos y Estudios Diagnosticos Disponibles", fontsize=9, fontweight="bold", color="#1e293b")
ax.text(1.2, 3.65, "Los siguientes examenes han sido subidos y validados por tu fisioterapeuta especialista:", fontsize=7.5, color="#64748b")

ex1 = patches.FancyBboxPatch((1.2, 2.5), 7.6, 0.95, boxstyle="round,pad=0.06", facecolor="#f8fafc", edgecolor="#cbd5e1", lw=0.8)
ax.add_patch(ex1)
ax.text(1.4, 3.15, "[DOC] Resonancia Magnetica de Columna Lumbosacra", fontsize=8, fontweight="bold", color="#1d4ed8")
ax.text(1.4, 2.85, "Fecha de estudio: 25/09/2026 | Subido por: Dr. Pedro Fernandez | Estado: [VALIDADO]\nDiagnostico: Protrusion discal L4-L5 sin estenosis severa. Indicada terapia de descompresion.", fontsize=6.8, color="#334155")
d1 = patches.FancyBboxPatch((7.6, 2.75), 1.0, 0.4, boxstyle="round,pad=0.04", facecolor="#22c55e", edgecolor="#16a34a", lw=1)
ax.add_patch(d1)
ax.text(8.1, 2.95, "Descargar PDF", fontsize=6.5, fontweight="bold", color="white", ha="center", va="center")

ex2 = patches.FancyBboxPatch((1.2, 1.4), 7.6, 0.95, boxstyle="round,pad=0.06", facecolor="#f8fafc", edgecolor="#cbd5e1", lw=0.8)
ax.add_patch(ex2)
ax.text(1.4, 2.05, "[IMG] Radiografia Digital AP y Lateral de Rodilla Derecha", fontsize=8, fontweight="bold", color="#1d4ed8")
ax.text(1.4, 1.75, "Fecha de estudio: 18/09/2026 | Subido por: Lic. Jennifer Alarcon | Estado: [VALIDADO]\nObservacion: Sin evidencia de fractura ni calcificaciones anormales. Espacio articular conservado.", fontsize=6.8, color="#334155")
d2 = patches.FancyBboxPatch((7.6, 1.65), 1.0, 0.4, boxstyle="round,pad=0.04", facecolor="#22c55e", edgecolor="#16a34a", lw=1)
ax.add_patch(d2)
ax.text(8.1, 1.85, "Descargar PDF", fontsize=6.5, fontweight="bold", color="white", ha="center", va="center")

plt.tight_layout()
p2 = os.path.join(out_dir, "ui_mi_cuenta.png")
plt.savefig(p2, dpi=300, bbox_inches="tight")
plt.close()

# 3. UI: ADMIN CITAS Y MODAL RESULTADOS
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6.5)
ax.axis("off")
draw_window_frame(ax, 0.5, 0.4, 9.0, 5.7, "FisioMedi Admin | Gestion de Citas y Carga de Resultados - /admin/citas")

ax.text(0.9, 5.25, "Panel Administrativo: Gestion de Citas", fontsize=11, fontweight="bold", color="#0f172a")
ax.text(0.9, 5.0, "Control de reservas, asignacion de especialistas en tiempo real y registro de resultados", fontsize=7.5, color="#64748b")

f1 = patches.FancyBboxPatch((0.9, 4.4), 1.0, 0.35, boxstyle="round,pad=0.04", facecolor="#0f172a", edgecolor="#0f172a")
ax.add_patch(f1)
ax.text(1.4, 4.57, "Activas", fontsize=7, fontweight="bold", color="white", ha="center", va="center")

for idx, flt in enumerate(["Pendientes (2)", "Confirmadas (4)", "Completadas (8)"]):
    fb = patches.FancyBboxPatch((2.0 + idx * 1.5, 4.4), 1.4, 0.35, boxstyle="round,pad=0.04", facecolor="#f8fafc", edgecolor="#cbd5e1")
    ax.add_patch(fb)
    ax.text(2.0 + idx * 1.5 + 0.7, 4.57, flt, fontsize=7, color="#334155", ha="center", va="center")

ax.text(6.8, 4.57, "Filtrar por medico:", fontsize=7, fontweight="bold", color="#475569")
sel_med = patches.FancyBboxPatch((7.8, 4.4), 1.7, 0.35, boxstyle="round,pad=0.04", facecolor="#ffffff", edgecolor="#3b82f6")
ax.add_patch(sel_med)
ax.text(8.65, 4.57, "Dr. Pedro Fernandez v", fontsize=6.8, color="#1e40af", ha="center", va="center")

tbl = patches.FancyBboxPatch((0.9, 2.5), 8.2, 1.7, boxstyle="round,pad=0.06", facecolor="#ffffff", edgecolor="#cbd5e1", lw=1)
ax.add_patch(tbl)
tbl_hdr = patches.Rectangle((0.9, 3.85), 8.2, 0.35, facecolor="#f8fafc", edgecolor="#cbd5e1")
ax.add_patch(tbl_hdr)
ax.text(1.3, 4.02, "Fecha / Hora", fontsize=7, fontweight="bold", color="#475569")
ax.text(2.7, 4.02, "Paciente", fontsize=7, fontweight="bold", color="#475569")
ax.text(4.4, 4.02, "Servicio", fontsize=7, fontweight="bold", color="#475569")
ax.text(5.9, 4.02, "Especialista Asignado", fontsize=7, fontweight="bold", color="#475569")
ax.text(7.7, 4.02, "Estado / Acciones", fontsize=7, fontweight="bold", color="#475569")

ax.text(1.3, 3.55, "28/09 - 10:00", fontsize=7, color="#0f172a")
ax.text(2.7, 3.55, "Juan Carlos Perez\n(987 654 321)", fontsize=6.5, color="#0f172a")
ax.text(4.4, 3.55, "Fisioterapia Columna", fontsize=6.8, color="#334155")

sp_btn = patches.FancyBboxPatch((5.7, 3.4), 1.5, 0.35, boxstyle="round,pad=0.04", facecolor="#ffffff", edgecolor="#3b82f6")
ax.add_patch(sp_btn)
ax.text(6.45, 3.57, "Dr. P. Fernandez v", fontsize=6.2, color="#1d4ed8", ha="center", va="center")

res_btn = patches.FancyBboxPatch((7.4, 3.4), 1.55, 0.35, boxstyle="round,pad=0.04", facecolor="#eff6ff", edgecolor="#3b82f6")
ax.add_patch(res_btn)
ax.text(8.175, 3.57, "[+] Ingresar resultados", fontsize=6.2, fontweight="bold", color="#1d4ed8", ha="center", va="center")

modal = patches.FancyBboxPatch((1.8, 0.6), 6.4, 1.7, boxstyle="round,pad=0.08", facecolor="#ffffff", edgecolor="#2563eb", lw=1.8)
ax.add_patch(modal)
m_hdr = patches.Rectangle((1.8, 1.95), 6.4, 0.35, facecolor="#1e40af", edgecolor="#1e40af")
ax.add_patch(m_hdr)
ax.text(5.0, 2.12, "MODAL: Ingresar Resultados Medicos (Resonancia / Rayos X)", fontsize=7.5, fontweight="bold", color="#ffffff", ha="center", va="center")

ax.text(2.1, 1.7, "* Archivo: informe_resonancia_lumbosacra.pdf (7.8 MB)\n* Titulo del Examen: Resonancia Magnetica de Columna Lumbosacra\n* Diagnostico Clinico: Protrusion discal L4-L5 sin compromiso medular. Plan: 10 sesiones fisioterapia.\n* [X] Marcar la cita como Completada automaticamente", fontsize=6.8, color="#1e293b")

btn_save = patches.FancyBboxPatch((5.8, 0.72), 2.2, 0.32, boxstyle="round,pad=0.04", facecolor="#16a34a", edgecolor="#15803d")
ax.add_patch(btn_save)
ax.text(6.9, 0.88, "Guardar y Publicar >>", fontsize=6.5, fontweight="bold", color="white", ha="center", va="center")

plt.tight_layout()
p3 = os.path.join(out_dir, "ui_admin_citas.png")
plt.savefig(p3, dpi=300, bbox_inches="tight")
plt.close()

# 4. UI: FICHA INTEGRAL DE PACIENTES
fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
ax.set_xlim(0, 10)
ax.set_ylim(0, 6.5)
ax.axis("off")
draw_window_frame(ax, 0.5, 0.4, 9.0, 5.7, "FisioMedi Admin | Ficha Clinica del Paciente - /admin/pacientes/[id]")

ax.text(0.9, 5.25, "Ficha Clinica: Juan Carlos Perez Gomez", fontsize=11, fontweight="bold", color="#0f172a")
ax.text(0.9, 4.95, "DNI: 71234567 | Telefono: +51 987 654 321 | Correo: juan.perez@email.com", fontsize=7.5, color="#64748b")

# Left Column: Historia Clinica
b_hist = patches.FancyBboxPatch((0.9, 1.8), 4.2, 2.9, boxstyle="round,pad=0.06", facecolor="#ffffff", edgecolor="#cbd5e1")
ax.add_patch(b_hist)
ax.text(1.1, 4.45, "Historia Clinica y Sesiones Terapeuticas", fontsize=8, fontweight="bold", color="#1e40af")
ax.text(1.1, 3.8, "* 25/09/2026 - Dr. Pedro Fernandez\n  Motivo: Evaluacion de resonancia lumbar\n  Diagnostico: Protrusion discal L4-L5\n  Tto: Terapia manual + traccion lumbar suave\n\n* 18/09/2026 - Lic. Jennifer Alarcon\n  Motivo: Primera consulta dolor lumbar agudo\n  Tto: Magnetoterapia y crioterapia local", fontsize=6.8, color="#334155")

# Right Column: Examenes y Resultados
b_exam = patches.FancyBboxPatch((5.3, 1.8), 4.2, 2.9, boxstyle="round,pad=0.06", facecolor="#ffffff", edgecolor="#cbd5e1")
ax.add_patch(b_exam)
ax.text(5.5, 4.45, "Examenes y Resultados Archivados", fontsize=8, fontweight="bold", color="#15803d")
ax.text(5.5, 3.8, "[VALIDADO] Resonancia Columna Lumbosacra.pdf\n  Fecha: 25/09/2026 | 7.8 MB | Dr. Pedro Fernandez\n  [Descargar] [Validar] [Rechazar / Borrar]\n\n[VALIDADO] Radiografia Rodilla Derecha.png\n  Fecha: 18/09/2026 | 3.2 MB | Lic. Jennifer Alarcon\n  [Descargar] [Validar] [Rechazar / Borrar]", fontsize=6.8, color="#334155")

# Bottom Section: Cuenta de Acceso
b_acc = patches.FancyBboxPatch((0.9, 0.6), 8.6, 1.0, boxstyle="round,pad=0.06", facecolor="#f0fdf4", edgecolor="#86efac")
ax.add_patch(b_acc)
ax.text(1.1, 1.35, "Cuenta de Acceso al Portal del Paciente [ACTIVA]", fontsize=8, fontweight="bold", color="#166534")
ax.text(1.1, 1.0, "Usuario (DNI): 71234567 | Estado: Clave actualizada por el paciente | Primer login completado\nPermite al paciente ingresar a /mi-cuenta para consultar citas y descargar sus informes y resonancias.", fontsize=6.8, color="#14532d")

plt.tight_layout()
p4 = os.path.join(out_dir, "ui_ficha_paciente.png")
plt.savefig(p4, dpi=300, bbox_inches="tight")
plt.close()

print("All 4 UI mockups generated successfully!")
