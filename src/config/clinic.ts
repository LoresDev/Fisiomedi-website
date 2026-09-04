export interface Service {
  id: string;
  name: string;
  description: string;
  durationMin: number;
}

export const clinic = {
  name: "Fisiomedi",
  tagline: "Centro de Terapia Física y Rehabilitación",
  heroText:
    "Recupera tu movilidad y mejora tu calidad de vida con un equipo de especialistas en terapia física y rehabilitación.",
  phone: "+51 960 197 658",
  phoneHref: "tel:+51960197658",
  whatsapp: "51960197658",
  email: "contacto@fisiomedi.pe",
  instagramHandle: "@fisiomedi_oficial",
  instagramUrl: "https://www.instagram.com/fisiomedi_oficial/",
  address: "Av. Universitaria 954, San Martín de Porres 15103, Lima, Perú",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+Universitaria+954%2C+San+Martin+de+Porres%2C+Lima%2C+Peru",
  hours: [
    { days: "Lunes a Viernes", time: "9:00 – 20:00" },
    { days: "Sábado", time: "9:00 – 20:00" },
    { days: "Domingo", time: "Cerrado" },
  ],
  schedule: {
    firstDay: 1,
    lastDay: 6,
    startHour: 9,
    endHour: 20,
  },
};

export const services: Service[] = [
  {
    id: "fisioterapia-ortopedica",
    name: "Fisioterapia Ortopédica",
    description:
      "Tratamiento de lesiones de huesos, articulaciones, ligamentos y tendones, así como recuperación postoperatoria.",
    durationMin: 45,
  },
  {
    id: "rehabilitacion-deportiva",
    name: "Rehabilitación Deportiva",
    description:
      "Prevención y recuperación de lesiones deportivas para volver a entrenar con seguridad y rendimiento.",
    durationMin: 60,
  },
  {
    id: "terapia-manual",
    name: "Terapia Manual",
    description:
      "Técnicas manuales especializadas para aliviar el dolor, mejorar la movilidad articular y liberar tensiones musculares.",
    durationMin: 45,
  },
  {
    id: "rehabilitacion-neurologica",
    name: "Rehabilitación Neurológica",
    description:
      "Terapia para pacientes con afecciones del sistema nervioso: accidente cerebrovascular, parálisis facial y más.",
    durationMin: 60,
  },
  {
    id: "electroterapia",
    name: "Electroterapia y Ultrasonido",
    description:
      "Equipos de última generación para reducir dolor e inflamación y acelerar la recuperación de los tejidos.",
    durationMin: 30,
  },
  {
    id: "drenaje-linfatico",
    name: "Drenaje Linfático Manual",
    description:
      "Técnica que estimula el sistema linfático para reducir retención de líquidos, edemas y mejorar la circulación.",
    durationMin: 45,
  },
];

export const highlights = [
  {
    title: "Atención personalizada",
    text: "Planes de tratamiento diseñados según tu diagnóstico y objetivos de recuperación.",
  },
  {
    title: "Profesionales certificados",
    text: "Equipo de fisioterapeutas colegiados con experiencia en distintas áreas de rehabilitación.",
  },
  {
    title: "Horario flexible",
    text: "Te atendemos de lunes a sábado de 9:00 am a 8:00 pm para adaptarnos a tu rutina.",
  },
];
