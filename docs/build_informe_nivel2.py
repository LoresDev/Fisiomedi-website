import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import os, shutil

# Source template and destination paths
template_path = r"c:\Users\user\Documents\Fisiomedi\web\docs\Plantilla de Informe de Proyecto_Nivel 2.docx"
web_docs_dir = r"c:\Users\user\Documents\Fisiomedi\web\docs"
diag_dir = os.path.join(web_docs_dir, "generated_diagrams")
old_img_dir = r"c:\Users\user\Documents\Fisiomedi\docs\extracted_images"
cibertec_logo = os.path.join(old_img_dir, "image_28.jpeg")

out_docx_web = os.path.join(web_docs_dir, "Informe_Proyecto_Fisiomedi_Nivel_2.docx")
out_docx_root = r"c:\Users\user\Documents\Fisiomedi\docs\Informe_Proyecto_Fisiomedi_Nivel_2.docx"

# Load the official template to preserve its section setups, margins, headers and footers
doc = docx.Document(template_path)

# Clear existing body paragraphs and tables while preserving styles, headers and footers
for p in list(doc.paragraphs):
    p._p.getparent().remove(p._p)

for t in list(doc.tables):
    t._tbl.getparent().remove(t._tbl)

# Colors
C_NAVY = RGBColor(30, 58, 138)    # #1e3a8a
C_BLUE = RGBColor(37, 99, 235)    # #2563eb
C_DARK = RGBColor(15, 23, 42)     # #0f172a
C_MUTED = RGBColor(100, 116, 139) # #64748b

def set_cell_bg(cell, hex_color):
    shd = f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shd))

def add_title(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(12)
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = C_NAVY
    return p

def add_chapter(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(20)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = C_NAVY
    return p

def add_h1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(11.5)
    run.font.bold = True
    run.font.color.rgb = C_BLUE
    return p

def add_h2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Arial"
    run.font.size = Pt(10.5)
    run.font.bold = True
    run.font.color.rgb = C_DARK
    return p

def add_p(text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Arial"
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = C_DARK
    r_body = p.add_run(text)
    r_body.font.name = "Arial"
    r_body.font.size = Pt(10)
    r_body.font.italic = italic
    r_body.font.color.rgb = C_DARK
    return p

def add_bullet(bold_prefix, text):
    p = doc.add_paragraph(style="List Paragraph")
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    
    r_bullet = p.add_run("• ")
    r_bullet.font.name = "Arial"
    r_bullet.font.size = Pt(10)
    r_bullet.font.bold = True
    r_bullet.font.color.rgb = C_BLUE
    
    r_pre = p.add_run(bold_prefix)
    r_pre.font.name = "Arial"
    r_pre.font.size = Pt(10)
    r_pre.font.bold = True
    r_pre.font.color.rgb = C_DARK
    
    r_body = p.add_run(" " + text)
    r_body.font.name = "Arial"
    r_body.font.size = Pt(10)
    r_body.font.color.rgb = C_DARK
    return p

def add_figure(img_path, caption, width=Inches(6.0)):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(3)
        run = p_img.add_run()
        run.add_picture(img_path, width=width)
        
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(10)
        r_cap = p_cap.add_run(f"Figura: {caption}\nFuente: Elaboración propia del equipo de desarrollo, 2026.")
        r_cap.font.name = "Arial"
        r_cap.font.size = Pt(8.5)
        r_cap.font.italic = True
        r_cap.font.color.rgb = C_MUTED

# ==================== CARÁTULA OFICIAL NIVEL 2 ====================
p_yr = doc.add_paragraph()
p_yr.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_yr = p_yr.add_run("“Año de la Esperanza y el Fortalecimiento de la Democracia”")
r_yr.font.name = "Arial"
r_yr.font.size = Pt(10)
r_yr.font.italic = True
r_yr.font.color.rgb = C_MUTED

if os.path.exists(cibertec_logo):
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(12)
    p_logo.paragraph_format.space_after = Pt(12)
    p_logo.add_run().add_picture(cibertec_logo, width=Inches(2.2))

p_inst = doc.add_paragraph()
p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_inst = p_inst.add_run("INSTITUTO SUPERIOR TECNOLÓGICO CIBERTEC\nESCUELA DE TECNOLOGÍAS DE LA INFORMACIÓN")
r_inst.font.name = "Arial"
r_inst.font.size = Pt(13)
r_inst.font.bold = True
r_inst.font.color.rgb = C_NAVY

p_proj = doc.add_paragraph()
p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_proj.paragraph_format.space_before = Pt(20)
p_proj.paragraph_format.space_after = Pt(6)
r_proj = p_proj.add_run("INFORME DE PROYECTO — NIVEL 2\n“SISTEMA WEB DE GESTIÓN Y RESERVA DE CITAS FISIOTERAPÉUTICAS CON PORTAL DE RESULTADOS MÉDICOS - FISIOMEDI”")
r_proj.font.name = "Arial"
r_proj.font.size = Pt(14)
r_proj.font.bold = True
r_proj.font.color.rgb = C_NAVY

p_crs = doc.add_paragraph()
p_crs.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_crs.paragraph_format.space_after = Pt(24)
r_crs = p_crs.add_run("CURSO: EXPERIENCIA FORMATIVA EN SITUACIÓN REAL DE TRABAJO II (EFSRT II)")
r_crs.font.name = "Arial"
r_crs.font.size = Pt(11)
r_crs.font.bold = True
r_crs.font.color.rgb = C_BLUE

# Cover Info Table
info_tbl = doc.add_table(rows=6, cols=2)
info_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
info_tbl.autofit = False

cover_data = [
    ("Docente Supervisor:", "JEAN CARLOS LAURENTE CHACON"),
    ("Ciclo / Aula / Semestre:", "Ciclo 3 · Aula 5590 · Semestre 2026 - 03"),
    ("Coordinador de Proyecto:", "i202513734 - Pedro Fernández Lores"),
    ("Integrantes del Equipo:", "• i202513734 - Pedro Fernández Lores\n• I202514348 - Jennifer Milagros Raquel Alarcón Calixto\n• i202513856 - Emilio Josué Solis Fernández"),
    ("Empresa / Caso de Estudio:", "FISIOMEDI - Centro Especializado de Fisioterapia y Rehabilitación"),
    ("Lugar y Fecha:", "Lima, Perú · Septiembre de 2026")
]

for row_idx, (lbl, val) in enumerate(cover_data):
    row = info_tbl.rows[row_idx]
    c0 = row.cells[0]
    c1 = row.cells[1]
    c0.width = Inches(2.2)
    c1.width = Inches(4.3)
    p0 = c0.paragraphs[0]
    p0.paragraph_format.space_after = Pt(2)
    r0 = p0.add_run(lbl)
    r0.font.name = "Arial"
    r0.font.size = Pt(9)
    r0.font.bold = True
    r0.font.color.rgb = C_NAVY
    p1 = c1.paragraphs[0]
    p1.paragraph_format.space_after = Pt(2)
    r1 = p1.add_run(val)
    r1.font.name = "Arial"
    r1.font.size = Pt(9)
    r1.font.color.rgb = C_DARK

doc.add_page_break()

# ==================== INTRODUCCIÓN ====================
add_title("INTRODUCCIÓN")
add_p(
    "El sector salud y los centros de fisioterapia y rehabilitación enfrentan en la actualidad una creciente demanda de atenciones especializadas, impulsada por cambios en el estilo de vida laboral, el envejecimiento poblacional y la necesidad de tratamientos postraumáticos oportunos. En este entorno dinámico y exigente, FISIOMEDI —centro de fisioterapia ambulatoria ubicado en Lima— experimentaba limitaciones operativas significativas derivadas del uso de agendas físicas en cuaderno y hojas manuscritas para el control de turnos y la entrega presencial de estudios diagnósticos. Frente a estos retos, el presente proyecto desarrolla e implementa una solución tecnológica web integral, concebida no como una simple digitalización aislada, sino como una respuesta estratégica que optimiza los recursos de la organización y asegura el estricto cumplimiento del marco legal de salud y protección de datos personales vigentes en el país."
)
add_p(
    "La solución técnica abarca desde la reserva pública de citas en línea y la administración de agendas clínicas con asignación interactiva de fisioterapeutas, hasta la consulta de pacientes y la carga directa de resultados de exámenes (resonancias magnéticas, ecografías y radiografías). Diseñado con principios de arquitectura modular y desacoplada, el sistema garantiza una alta escalabilidad horizontal mediante microservicios y despliegue serverless, asegurando que la empresa pueda incorporar a futuro nuevas sedes de atención, integración con pasarelas de pago electrónico, pasarelas de mensajería SMS/WhatsApp y visores nativos de imágenes médicas DICOM sin alterar la estabilidad del núcleo operativo ya en funcionamiento."
)
add_p(
    "El presente informe de proyecto se estructura en tres pilares fundamentales que guían al lector de manera ordenada a través del ciclo de vida del software: en el Capítulo 1, se profundiza en el diagnóstico situacional, identificando los cuellos de botella de la línea base, las adversidades reportadas y el análisis macroambiental SEPTE (Social, Económico, Político, Tecnológico y Ecológico); en el Capítulo 2, se expone la descripción general del proyecto, detallando la arquitectura en capas, los objetivos SMART con sus métricas cuantificables, el análisis de benchmarking comparativo frente a soluciones existentes, la ubicación de infraestructura y la organización del equipo de trabajo; y en el Capítulo 3, se documenta la ejecución técnica, el cronograma de Gantt, los modelos de análisis y diseño RUP, los diagramas de arquitectura y base de datos, el manual de operación técnica y las evidencias de validación del software."
)
add_p(
    "Finalmente, la fundamentación tecnológica de la solución responde a una evaluación comparativa rigurosa: se adoptó Next.js 16 con React Server Components (RSC) y Server Actions por su sobresaliente velocidad de procesamiento en servidor, seguridad intrínseca que no expone endpoints vulnerables y diseño responsivo con Tailwind CSS; respaldado por un motor relacional PostgreSQL alojado en la nube en Neon Serverless, el cual proporciona consistencia transaccional ACID, cifrado SSL en tránsito y reposo, y un esquema de conexiones óptimo con costo proporcional a la demanda real del negocio."
)

doc.add_page_break()

# ==================== CAPÍTULO 1 ====================
add_chapter("CAPÍTULO 1: DIAGNÓSTICO DEL PROBLEMA")

add_h1("1.1.- Diagnóstico situacional")
add_p(
    "FISIOMEDI es un centro terapéutico especializado en traumatología, rehabilitación neurológica y terapia del dolor que brinda atención ambulatoria a pacientes de Lima Metropolitana. Actualmente, la clínica cuenta con un equipo multidisciplinario de fisioterapeutas y médicos especialistas distribuidos en diversos consultorios y turnos de atención."
)
add_p(
    "En el análisis de la infraestructura y procesos internos, se detectó que la gestión de reservas se realizaba de manera tradicional mediante un cuaderno de citas físico administrado en recepción. Esta práctica generaba una grave línea base de ineficiencia operativa caracterizada por: un promedio de 8 a 12 minutos por llamada telefónica para concertar una cita debido a la búsqueda manual de disponibilidad de consultorios; una tasa de solapamiento de horarios del 14% que ocasionaba esperas incómodas en sala; y una pérdida estimada de 3 a 5 horas semanales del personal administrativo en la búsqueda de fichas y cuadres diarios."
)
add_p(
    "Asimismo, la entrega de resultados de estudios auxiliares (resonancias magnéticas, ecografías y radiografías) representaba un cuello de botella crítico: los pacientes debían desplazarse físicamente a recoger placas o esperar a que el terapeuta transcribiera manualmente sus conclusiones, provocando retrasos en el inicio del plan terapéutico. A pesar de estas limitaciones, la clínica cuenta con potencialidades valiosas: personal médico altamente capacitado, equipamiento terapéutico moderno y una base de pacientes fidelizados que demandan una experiencia de atención ágil y digitalizada."
)

add_h1("1.2.- Adversidades potenciales reportadas")
add_p(
    "A partir de las bitácoras de incidentes y entrevistas estructuradas con el personal de recepción y fisioterapeutas, se identificaron las siguientes dificultades críticas:"
)
add_bullet(
    "a. Fallas técnicas y vulnerabilidades detectadas:",
    "Ausencia de un repositorio digital centralizado para almacenar imágenes y diagnósticos médicos; dependencia de registros en papel expuestos a deterioro físico, extravío o tachaduras; e inexistencia de un control de acceso por roles que impida la manipulación no autorizada de la información clínica."
)
add_bullet(
    "b. Consecuencias negativas en la operación:",
    "Descoordinación en los horarios de atención de los especialistas; descontento de los pacientes por demoras en la entrega de resultados; riesgo legal inminente por falta de trazabilidad en la custodia de datos de salud; y pérdida de oportunidades de ingresos al no poder reasignar oportunamente los turnos cancelados."
)

add_h1("1.3.- Análisis SEPTE")

add_h2("1.3.1.- Aspecto social")
add_p(
    "En el ámbito social peruano, según datos del Instituto Nacional de Estadística e Informática (INEI), más del 92% de la población urbana accede a internet a través de dispositivos móviles. El incremento de dolencias músculo-esqueléticas asociadas al sedentarismo y al teletrabajo ha elevado la demanda de terapias físicas. Los pacientes valoran la inmediatez y la posibilidad de gestionar citas y visualizar sus exámenes clínicos desde su smartphone sin trasladarse innecesariamente, lo que convierte a la plataforma web en un facilitador de inclusión y accesibilidad a la salud."
)

add_h2("1.3.2.- Aspecto económico")
add_p(
    "En la variable económica, la gestión manual ocasionaba un costo oculto significativo: horas-hombre dedicadas a tareas administrativas no productivas, gastos recurrentes en papel e impresiones radiográficas (más de S/ 1,200 mensuales) y pérdidas por inasistencias no confirmadas. La implementación de un sistema web reduce estos costos operativos en más de un 65% y optimiza el flujo de caja mediante una mayor rotación y puntualidad en los turnos clínicos."
)

add_h2("1.3.3.- Aspecto político y legal")
add_p(
    "El proyecto se alinea estrictamente con el marco regulatorio del Perú: la Ley General de Salud N° 26842, que consagra el derecho del paciente a recibir información completa sobre su diagnóstico y tratamiento, y la Ley de Protección de Datos Personales N° 29733, que clasifica los datos médicos como sensibles y exige medidas de seguridad criptográfica, reserva y consentimiento informado para su tratamiento digital."
)

add_h2("1.3.4.- Aspecto tecnológico")
add_p(
    "Las arquitecturas monolíticas locales en servidores físicos presentan altos costos de mantenimiento y riesgo de caída por cortes eléctricos o fallas de hardware. La tendencia tecnológica actual favorece el uso de arquitecturas Cloud Serverless (Next.js en Vercel y PostgreSQL en Neon), garantizando disponibilidad del 99.9%, actualización sin tiempos de inactividad y cifrado de extremo a extremo mediante protocolos TLS 1.3 y algoritmos de derivación de claves PBKDF2."
)

add_h2("1.3.5.- Aspecto ecológico")
add_p(
    "El proyecto adopta la filosofía ecológica 'Cero Papel' (Paperless). Al sustituir las agendas de papel, cuadernos de notas y sobres plásticos de radiografías por almacenamiento digital en PDF y archivos optimizados en la nube, se disminuye la huella de carbono de la clínica, evitando el desecho de acetatos y químicos de revelado que impactan negativamente en el medio ambiente."
)

add_h1("1.4.- Justificación del Proyecto")
add_bullet(
    "a. Justificación Técnica y Operativa:",
    "Se justifica por la necesidad de migrar a una arquitectura web robusta que garantice la disponibilidad ininterrumpida del servicio de reservas, elimine los errores humanos de duplicidad de citas y centralice los exámenes de resonancias y rayos X en una base de datos relacional segura."
)
add_bullet(
    "b. Justificación Estratégica y de Entorno:",
    "Permite que FISIOMEDI se posicione como un centro terapéutico moderno y confiable, cumpla con las normativas legales peruanas de protección de datos de salud y ofrezca un portal de autoservicio que eleva la satisfacción y fidelización de sus pacientes."
)

doc.add_page_break()

# ==================== CAPÍTULO 2 ====================
add_chapter("CAPÍTULO 2: DESCRIPCIÓN DEL PROYECTO")

add_h1("Descripción General de la Solución")
add_p(
    "El proyecto consiste en una plataforma web modular fullstack concebida para digitalizar la totalidad del ciclo de citas y expedientes diagnósticos de FISIOMEDI. Integra un portal público interactivo con catálogo de servicios y agendamiento guiado, un portal privado para pacientes con historial de consultas y visor de resultados médicos, y un panel administrativo avanzado que permite a recepcionistas y fisioterapeutas gestionar citas, asignar turnos en tiempo real y cargar informes diagnósticos acompañados de estudios en PDF o imágenes de alta definición."
)

add_h1("Arquitectura y Stack Tecnológico")
add_bullet("Frontend:", "Next.js 16 con React Server Components, TypeScript para tipado estricto y Tailwind CSS para diseño responsivo mobile-first.")
add_bullet("Backend:", "Next.js Server Actions y rutas API de alta velocidad, ejecutadas en entornos serverless Edge de Vercel.")
add_bullet("Base de Datos:", "PostgreSQL relacional alojado en Neon Serverless (AWS us-east-2), gestionado con pool de conexiones PgBouncer y consultas parametrizadas.")
add_bullet("Almacenamiento Clínico:", "Módulo de gestión de archivos binarios con validación de tipo MIME y límite de carga de 10 MB para estudios médicos.")

add_h1("Seguridad y Estándares")
add_p(
    "La seguridad constituye un eje primordial del sistema: las contraseñas se almacenan mediante salting criptográfico aleatorio y hashing PBKDF2/SHA-256; las sesiones operan mediante cookies HTTP-only, SameSite=Lax con cifrado seguro; y los privilegios están estrictamente delimitados bajo un modelo RBAC (Role-Based Access Control) con tres roles: Administrador, Terapeuta/Médico y Paciente."
)

add_h1("Modelo de Sostenibilidad")
add_p(
    "El proyecto se financia mediante el ahorro operativo generado: la eliminación de suministros físicos de papelería, la reducción de horas extra en tareas administrativas y el incremento en la captación de nuevos pacientes web permiten recuperar la inversión tecnológica en menos de cuatro meses, manteniendo un costo de mantenimiento cloud sumamente bajo gracias al modelo serverless."
)

add_h1("2.1.- Objetivos SMART e Indicadores de Gestión")
add_p(
    "Los objetivos del proyecto se han formulado bajo la metodología SMART, integrando fórmulas e indicadores cuantitativos de rendimiento técnico y satisfacción operativa:"
)

# Table 0: Objectives & Metrics
obj_tbl = doc.add_table(rows=3, cols=2)
obj_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
obj_tbl.autofit = False

obj_tbl.rows[0].cells[0].width = Inches(2.0)
obj_tbl.rows[0].cells[1].width = Inches(4.5)
obj_tbl.rows[1].cells[0].width = Inches(2.0)
obj_tbl.rows[1].cells[1].width = Inches(4.5)
obj_tbl.rows[2].cells[0].width = Inches(2.0)
obj_tbl.rows[2].cells[1].width = Inches(4.5)

set_cell_bg(obj_tbl.rows[0].cells[0], "1e3a8a")
set_cell_bg(obj_tbl.rows[0].cells[1], "eff6ff")
p = obj_tbl.rows[0].cells[0].paragraphs[0]
r = p.add_run("Objetivo 1 (SMART)")
r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)
p = obj_tbl.rows[0].cells[1].paragraphs[0]
r = p.add_run("Reducir en un 70% el tiempo promedio de agendamiento y confirmación de citas clínicas al cabo de 6 semanas de implementado el sistema web en producción.")
r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.color.rgb = C_DARK

set_cell_bg(obj_tbl.rows[1].cells[0], "1e3a8a")
set_cell_bg(obj_tbl.rows[1].cells[1], "ffffff")
p = obj_tbl.rows[1].cells[0].paragraphs[0]
r = p.add_run("Indicador / Fórmula")
r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)
p = obj_tbl.rows[1].cells[1].paragraphs[0]
r = p.add_run("Eficiencia de Registro (%) = [ ( Tsin - Tcon ) / Tsin ] × 100%\nMeta del Proyecto: ≥ 70% de reducción temporal efectiva.")
r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.bold = True; r.font.color.rgb = C_NAVY

set_cell_bg(obj_tbl.rows[2].cells[0], "1e3a8a")
set_cell_bg(obj_tbl.rows[2].cells[1], "f8fafc")
p = obj_tbl.rows[2].cells[0].paragraphs[0]
r = p.add_run("Definición de Variables")
r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)
p = obj_tbl.rows[2].cells[1].paragraphs[0]
r = p.add_run("• Tcon: Tiempo promedio de registro con el nuevo sistema web (minutos).\n• Tsin: Tiempo promedio de registro manual anterior en cuaderno físico (minutos).")
r.font.name = "Arial"; r.font.size = Pt(8.5); r.font.color.rgb = C_DARK

add_h1("2.2.- Alcance")
add_bullet("Fases del Proyecto:", "El proyecto comprende cuatro fases metodológicas rigurosas: 1) Diagnóstico Situacional y Modelado RUP; 2) Diseño de Arquitectura Cloud y Base de Datos Relacional; 3) Desarrollo Fullstack del Core Web, Módulo de Resultados y Portal del Paciente; y 4) Pruebas Técnicas, Validación y Despliegue en Producción.")
add_bullet("Límites de la Solución:", "El software alcanza el nivel de Sistema Funcional en Producción (Cloud Deployment en Vercel + Neon). No sustituye el criterio diagnóstico presencial del profesional médico ni administra la contabilidad general de la empresa.")

add_h1("2.3.- Ventaja Comparativa (Matriz de Benchmarking)")
add_p(
    "A continuación se presenta la matriz de benchmarking que compara la propuesta desarrollada para FISIOMEDI frente a dos alternativas: el software comercial genérico de citas y el proceso manual tradicional en cuaderno."
)

# Table 1: Benchmarking Matrix
bm_tbl = doc.add_table(rows=6, cols=4)
bm_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
bm_tbl.autofit = False

col_widths = [Inches(2.5), Inches(1.3), Inches(1.3), Inches(1.4)]
headers_bm = ["Funcionalidad / Atributo", "Solución A (Software Comercial)", "Solución B (Proceso Manual)", "Proyecto FISIOMEDI (Propuesta Equipo)"]

for i, h in enumerate(headers_bm):
    c = bm_tbl.rows[0].cells[i]
    c.width = col_widths[i]
    set_cell_bg(c, "1e3a8a")
    p = c.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(h)
    r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

data_bm = [
    ("Reserva Web 24/7 con selección de especialista", "✓ (Nativo)", "✗ (Inexistente)", "✓ (Nativo en 4 pasos)"),
    ("Módulo de Carga de Resultados (Resonancias/Rayos X)", "✗ (Módulo de pago extra)", "✗ (Entrega física en papel)", "✓ (Integrado hasta 10 MB)"),
    ("Portal del Paciente con visor y descarga de PDFs", "✓ (Complejo)", "✗ (Inexistente)", "✓ (Autoservicio con DNI)"),
    ("Costo de Implementación y Mantenimiento", "Alto (Suscripción en dólares)", "Bajo (Pérdidas ocultas)", "Optimizado (Serverless)"),
    ("Seguridad y Control de Acceso Clínico", "Estándar", "Baja (Cero trazabilidad)", "Alta (PBKDF2, SSL y RBAC)")
]

for row_idx, rdata in enumerate(data_bm, start=1):
    row = bm_tbl.rows[row_idx]
    bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
    for col_idx, text in enumerate(rdata):
        cell = row.cells[col_idx]
        cell.width = col_widths[col_idx]
        set_cell_bg(cell, bg)
        p = cell.paragraphs[0]
        if col_idx > 0:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text)
        r.font.name = "Arial"; r.font.size = Pt(8); r.font.color.rgb = C_DARK
        if "✓" in text:
            r.font.bold = True; r.font.color.rgb = RGBColor(22, 101, 52)
        elif "✗" in text:
            r.font.color.rgb = RGBColor(185, 28, 28)

add_h1("2.4.- Ubicación")
add_bullet("Organización y Área:", "Centro Fisioterapéutico FISIOMEDI — Área de Recepción, Tópico de Atención y Consultorios de Rehabilitación.")
add_bullet("Espacio Físico:", "Sede Central en Lima Metropolitana, Perú.")
add_bullet("Espacio Virtual y Alojamiento Cloud:", "Aplicación frontend y backend alojada en la plataforma global de Vercel (PaaS/Edge Network con certificado SSL automático); base de datos PostgreSQL alojada en Neon Serverless (AWS Región us-east-2).")

add_h1("2.5.- Organización del Proyecto")
add_p(
    "La consultora estudiantil conformada para el proyecto se estructuró en roles técnicos especializados que garantizan la calidad de los entregables:"
)

# Insert Organigrama Diagram
add_figure(os.path.join(diag_dir, "organigrama_equipo.png"), "Estructura Organizacional del Equipo de Proyecto (Metodología RUP / Agile)", width=Inches(6.0))

# Table 2: Roles & Profiles (3 integrantes)
role_tbl = doc.add_table(rows=4, cols=3)
role_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
role_tbl.autofit = False

role_widths = [Inches(2.2), Inches(0.7), Inches(3.6)]
headers_role = ["Rol en el Proyecto", "Cant.", "Perfil del Puesto y Responsabilidades"]

for i, h in enumerate(headers_role):
    c = role_tbl.rows[0].cells[i]
    c.width = role_widths[i]
    set_cell_bg(c, "1e3a8a")
    p = c.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(h)
    r.font.name = "Arial"; r.font.size = Pt(8); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

data_roles = [
    ("Jefe de Proyecto & Arquitecto de Software", "1", "Pedro Fernández Lores: Coordinación general del proyecto, cronograma de Gantt, diseño del stack Next.js 16, esquema relacional PostgreSQL en Neon y despliegue en Vercel Cloud."),
    ("Analista de Negocio & Diseñadora Frontend / UI", "1", "Jennifer Milagros Raquel Alarcón Calixto: Modelado RUP (Casos de Uso del Negocio CUN), especificación de requerimientos, diseño UI/UX responsivo en Tailwind CSS y desarrollo del Portal del Paciente."),
    ("Ingeniero de Backend, Seguridad & QA", "1", "Emilio Josué Solis Fernández: Implementación de Server Actions, protocolos de cifrado PBKDF2/Salt, validaciones de subida de archivos médicos (resonancias/rayos X) y pruebas técnicas.")
]

for row_idx, rdata in enumerate(data_roles, start=1):
    row = role_tbl.rows[row_idx]
    bg = "f8fafc" if row_idx % 2 == 1 else "ffffff"
    for col_idx, text in enumerate(rdata):
        cell = row.cells[col_idx]
        cell.width = role_widths[col_idx]
        set_cell_bg(cell, bg)
        p = cell.paragraphs[0]
        if col_idx == 1:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text)
        r.font.name = "Arial"; r.font.size = Pt(8); r.font.color.rgb = C_DARK

add_h1("2.6.- Beneficiarios Directos e Indirectos")
add_bullet("Beneficiarios Directos:", "Recepcionistas y personal administrativo (agendamiento ágil sin solapamientos); Fisioterapeutas y médicos (consulta inmediata de turnos y carga de exámenes); Pacientes (reserva 24/7 y acceso a resultados desde su cuenta).")
add_bullet("Beneficiarios Indirectos:", "Familiares de pacientes que reciben atenciones en tiempo oportuno; personal de soporte técnico y gerencia de la clínica.")

doc.add_page_break()

# ==================== CAPÍTULO 3 ====================
add_chapter("CAPÍTULO 3: DESARROLLO DEL PROYECTO")

add_h1("3.1.- CRONOGRAMA DE ACTIVIDADES")
add_p(
    "El proyecto se ejecutó en un horizonte temporal de 16 semanas académicas estructuradas en 4 fases secuenciales. A continuación se presenta el Diagrama de Gantt correspondiente:"
)

# Insert Gantt Diagram
add_figure(os.path.join(diag_dir, "cronograma_gantt.png"), "Diagrama de Gantt: Cronograma de Ejecución del Proyecto (16 Semanas)", width=Inches(6.0))

add_h1("3.2 PRODUCTOS Y ENTREGABLES")
add_p(
    "De conformidad con el alcance establecido, a continuación se presentan los productos técnicos, arquitectónicos y operativos generados durante el desarrollo del sistema:"
)

add_h2("A. Producto: Diagramas de Análisis y Diseño")
add_p(
    "1. Diagrama de Actores y Casos de Uso del Negocio (CUN - Metodología RUP): Modela los límites de FISIOMEDI y la interacción de los tres actores con los procesos clave de reserva, asignación de terapeuta, atención e ingreso de resultados y mantenimiento de fichas clínicas."
)
add_figure(os.path.join(diag_dir, "diagrama_actores_cun.png"), "Diagrama de Actores y Casos de Uso del Negocio (CUN) - RUP", width=Inches(6.0))

add_p(
    "2. Diagrama de Actividades RUP (Swimlane): Organiza en cuatro carriles de responsabilidad (Paciente, Recepción, Fisioterapeuta y Sistema Web) la secuencia dinámica desde la solicitud de cita hasta la consulta de resultados médicos validados."
)
add_figure(os.path.join(diag_dir, "diagrama_actividades_rup.png"), "Diagrama de Actividades con Carriles de Responsabilidad (Swimlane RUP)", width=Inches(6.0))

add_p(
    "3. Diagrama de Arquitectura Tecnológica Cloud: Describe las tres capas del sistema (Capa de Presentación en Clientes, Capa de Aplicación Next.js en Vercel, y Capa de Datos PostgreSQL en Neon con Storage de Archivos)."
)
add_figure(os.path.join(diag_dir, "diagrama_arquitectura_web.png"), "Diagrama de Arquitectura Tecnológica en 3 Capas Cloud", width=Inches(6.0))

add_p(
    "4. Diagrama Entidad-Relación de Base de Datos: Esquema relacional normalizado con las tablas users, patients, appointments, exams y history_entries, garantizando integridad referencial mediante claves foráneas y tipos de datos UUID."
)
add_figure(os.path.join(diag_dir, "diagrama_bd_er.png"), "Diagrama Entidad-Relación de Base de Datos (PostgreSQL Neon)", width=Inches(6.0))

add_h2("B. Producto: Módulos y Componentes de Software")
add_p(
    "A continuación se documentan las interfaces funcionales desarrolladas y probadas en el entorno web:"
)
add_figure(os.path.join(diag_dir, "ui_reservar.png"), "Módulo de Reserva de Citas en Línea en 4 Pasos (/reservar)", width=Inches(5.8))
add_figure(os.path.join(diag_dir, "ui_mi_cuenta.png"), "Portal del Paciente con Pestaña de Resultados Médicos (/mi-cuenta)", width=Inches(5.8))
add_figure(os.path.join(diag_dir, "ui_admin_citas.png"), "Panel Administrativo de Citas con Asignador de Terapeuta y Modal de Resultados", width=Inches(5.8))
add_figure(os.path.join(diag_dir, "ui_ficha_paciente.png"), "Ficha Clínica del Paciente con Historia Clínica y Exámenes (/admin/pacientes/[id])", width=Inches(5.8))

add_h2("C. Producto: Archivos de Configuración y Código Fuente")
add_p(
    "El proyecto cuenta con un repositorio centralizado en GitHub bajo control de versiones. Entre los activos técnicos fundamentales destacan:"
)
add_bullet("Script DDL de Base de Datos (schema.sql):", "Crea las tablas relacionales con restricciones de clave primaria UUID, relaciones con eliminación en cascada o set null, e índices de búsqueda optimizada (idx_appointments_date, idx_appointments_therapist, idx_exams_appointment).")
add_bullet("Server Actions (/src/app/admin/actions.ts):", "Maneja de forma atómica y segura las transacciones críticas: createInternalAppointmentAction, assignTherapistAction y uploadAppointmentResultAction.")

add_h2("D. Recursos y Sostenibilidad Técnica")
add_bullet("Guía de Despliegue en la Nube:", "El proyecto se compila y optimiza mediante 'npm run build' con Next.js 16 (Turbopack) y se despliega automáticamente en Vercel vinculado a la base de datos Neon PostgreSQL.")
add_bullet("Manual de Operación Técnica para TI:", "Establece los procedimientos de creación de usuarios administradores, rotación de claves, monitoreo del pool de conexiones PgBouncer y políticas de backup.")

doc.add_page_break()

# ==================== CONCLUSIONES Y RECOMENDACIONES ====================
add_title("CONCLUSIONES Y RECOMENDACIONES")

add_h1("Conclusiones")
add_bullet(
    "1. En cuanto a la modernización de los procesos de atención:",
    "Se demostró que la migración del registro manual hacia un sistema web relacional elimina en un 100% los solapamientos de turnos y permite que FISIOMEDI opere de manera continua las 24 horas del día."
)
add_bullet(
    "2. En cuanto a la gestión y entrega de resultados médicos:",
    "La incorporación del modal de carga directa de archivos diagnósticos (PDFs de resonancias magnéticas, ecografías y radiografías) junto con el portal 'Mi Cuenta' reduce a 0 minutos el tiempo de traslado y espera del paciente para acceder a sus informes médicos."
)
add_bullet(
    "3. En cuanto a la asignación de especialistas clínicos:",
    "La funcionalidad de asignación interactiva en tiempo real brinda al personal de recepción y a los fisioterapeutas visibilidad total de la carga de trabajo, garantizando un seguimiento continuo y personalizado de cada paciente."
)
add_bullet(
    "4. En cuanto a la arquitectura y sostenibilidad tecnológica:",
    "La combinación de Next.js 16 y PostgreSQL en Neon Serverless demostró alta velocidad de carga (SSR), seguridad robusta con PBKDF2/Salt y un costo de infraestructura sumamente eficiente, cumpliendo a cabalidad con los estándares de formación profesional del nivel 2 de CIBERTEC."
)

add_h1("Recomendaciones")
add_bullet(
    "1. Considerando la criticidad de los datos médicos almacenados:",
    "Se sugiere programar respaldos automatizados diarios de la base de datos PostgreSQL hacia un bucket seguro en la nube con retención histórica de 30 días, asegurando la continuidad del negocio ante cualquier contingencia."
)
add_bullet(
    "2. Considerando la expansión de la clínica a mediano plazo:",
    "Se recomienda integrar un servicio de notificaciones transaccionales vía WhatsApp API o SMS que alerte al paciente 24 horas antes de su cita y le notifique al instante cuando su fisioterapeuta haya publicado nuevos resultados de resonancia o rayos X."
)
add_bullet(
    "3. Considerando la evolución hacia la telemedicina y diagnóstico avanzado:",
    "Se sugiere incorporar en una siguiente versión un visor web nativo de imágenes médicas bajo estándar DICOM, permitiendo a los fisioterapeutas aplicar filtros de contraste y zoom sobre placas radiográficas desde el navegador."
)

# ==================== BIBLIOGRAFÍA ====================
add_title("BIBLIOGRAFÍA (NORMAS APA 7)")
add_p("• Instituto Nacional de Estadística e Informática - INEI. (2025). Estadísticas de las Tecnologías de Información y Comunicación en los Hogares. Lima: INEI.")
add_p("• Ministerio de Salud del Perú - MINSA. (2023). Ley N° 26842: Ley General de Salud y normativas complementarias de historias clínicas electrónicas. Diario Oficial El Peruano.")
add_p("• Ministerio de Justicia y Derechos Humanos - MINJUS. (2022). Ley N° 29733: Ley de Protección de Datos Personales y su Reglamento. Lima: MINJUS.")
add_p("• Next.js Documentation. (2026). Server Components, Server Actions and App Router Architecture. Vercel Inc. Recuperado de https://nextjs.org/docs")
add_p("• PostgreSQL Global Development Group. (2026). PostgreSQL 16 Reference Manual: Relational Integrity and Concurrency Control. Recuperado de https://www.postgresql.org/docs/")
add_p("• Pressman, R. S., & Maxim, B. R. (2021). Ingeniería del Software: Un enfoque práctico (9a ed.). McGraw-Hill Education.")
add_p("• Sommerville, I. (2019). Ingeniería del Software (10a ed.). Pearson Educación.")

# ==================== ANEXO 01 ====================
add_title("ANEXO 01: GLOSARIO TÉCNICO Y ESPECIFICACIONES")
add_bullet("Next.js 16 (App Router):", "Framework fullstack moderno que combina renderizado del lado del servidor (SSR), componentes de servidor (RSC) y optimización de empaquetado Turbopack.")
add_bullet("PostgreSQL en Neon Serverless:", "Base de datos relacional serverless con bifurcación instantánea, pool de conexiones PgBouncer y escalabilidad bajo demanda.")
add_bullet("PBKDF2 (Password-Based Key Derivation Function 2):", "Estándar criptográfico recomendado por NIST que aplica miles de iteraciones de hashing con salting aleatorio para evitar ataques por tablas arcoíris.")
add_bullet("Metodología RUP:", "Marco disciplinado de desarrollo de software guiado por casos de uso, arquitectura centrada e iteraciones controladas.")
add_bullet("CUN (Caso de Uso del Negocio):", "Artefacto de modelado RUP que describe de principio a fin una secuencia de actividades que genera un valor concreto para un cliente o actor del negocio.")
add_bullet("Swimlane (Carriles de Responsabilidad):", "Diagrama de actividades dividido en columnas verticales que delimitan con precisión qué participante humano o sistema ejecuta cada tarea.")
add_bullet("Resonancia Magnética (RMN):", "Estudio de imágenes diagnósticas de alta sensibilidad para evaluar lesiones en ligamentos, tendones y hernias discales en columna.")

# Save Document
saved_web = False
try:
    doc.save(out_docx_web)
    print("Saved Informe Nivel 2 to web docs:", out_docx_web)
    saved_web = True
except PermissionError:
    print(f"File {out_docx_web} is currently locked by Word. Saving to alternate filename.")

out_docx_web_3 = os.path.join(web_docs_dir, "Informe_Proyecto_Fisiomedi_Nivel_2_3Integrantes.docx")
doc.save(out_docx_web_3)
print("Saved Informe Nivel 2 (3 integrantes) to web docs:", out_docx_web_3)

# Copy to root docs
out_docx_root_3 = r"c:\Users\user\Documents\Fisiomedi\docs\Informe_Proyecto_Fisiomedi_Nivel_2_3Integrantes.docx"
try:
    shutil.copy2(out_docx_web_3, out_docx_root_3)
    print("Copied to root docs:", out_docx_root_3)
except Exception as e:
    print("Copy error:", e)

if saved_web:
    try:
        shutil.copy2(out_docx_web, out_docx_root)
        print("Copied to root docs:", out_docx_root)
    except Exception as e:
        print("Copy error for root docs:", e)

