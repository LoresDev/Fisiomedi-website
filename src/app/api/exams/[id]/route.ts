import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteExam, getExam, uploadsPath } from "@/lib/store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await context.params;
  const exam = await getExam(id);
  if (!exam) {
    return NextResponse.json({ error: "Examen no encontrado" }, { status: 404 });
  }

  // Security check for patients
  if (session.role === "paciente") {
    if (exam.patientId !== session.patientId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    if (exam.status === "rechazado") {
      return NextResponse.json(
        { error: "Este examen fue cancelado u observado por la clínica." },
        { status: 403 }
      );
    }
  }
  try {
    const { readFile } = await import("fs/promises");
    const buffer = await readFile(uploadsPath(exam.fileName));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": exam.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          exam.originalName
        )}"`,
      },
    });
  } catch {
    await deleteExam(id);
    return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 });
  }
}
