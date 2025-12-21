import Link from 'next/link';

const problems = [
  {
    title: 'Plazos que se escapan',
    desc: 'Las subastas se publican con ventanas breves. Si la alerta llega tarde, la oportunidad ya no existe.',
  },
  {
    title: 'Demasiado ruido',
    desc: 'Listados masivos y heterogéneos hacen difícil distinguir qué merece atención inmediata.',
  },
  {
    title: 'Riesgo de omisiones',
    desc: 'Equipos saturados y procesos manuales terminan dejando pasar activos valiosos o mal evaluados.',
  },
];

const solutions = [
  {
    title: 'Monitoreo continuo',
    desc: 'Captura automática de subastas en boletines oficiales con normalización y trazabilidad.',
  },
  {
    title: 'Alertas priorizadas',
    desc: 'Reglas basadas en valor, ubicación, fecha límite y criterios operativos para reducir ruido.',
  },
  {
    title: 'Contexto accionable',
    desc: 'Datos consolidados y listos para decidir: qué mirar, cuándo actuar y con qué riesgo.',
  },
];

const capabilities = [
  { title: 'Cobertura operativa', desc: 'Ingesta continua de subastas públicas con control de versiones y logs.' },
  { title: 'Filtros claros', desc: 'Criterios por importe, ubicación, estado y fechas para concentrar el esfuerzo.' },
  { title: 'Alertas tempranas', desc: 'Avisos antes de cierres de puja para preparar la decisión con tiempo.' },
  { title: 'Trazabilidad', desc: 'Registro de qué se detectó, cuándo y qué acciones se tomaron.' },
];

const useCases = [
  { title: 'Equipos de inversión', desc: 'Detectan activos atractivos antes de que cierre la ventana de puja.' },
  { title: 'Gestión de recuperaciones', desc: 'Prioriza subastas relevantes para maximizar recupero y liquidez.' },
  { title: 'Riesgo y cumplimiento', desc: 'Monitorea entidades y ubicaciones sensibles con avisos verificables.' },
  { title: 'Operaciones corporativas', desc: 'Reduce tiempo manual de búsqueda y evita omisiones en procesos críticos.' },
];

const trust = [
  { title: 'Gobierno único', desc: 'ADL Suite mantiene trazas, métricas y control de cambios sobre cada señal.' },
  { title: 'Sin promesas vacías', desc: 'Enfoque en lo que ya operamos: detección, normalización y alertado.' },
  { title: 'Seguridad y aislamiento', desc: 'Datos y credenciales segregados según políticas del cliente.' },
];

function SectionTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <div className="space-y-2">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>}
      <h2 className="text-2xl font-semibold text-slate">{title}</h2>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/80 p-5 shadow-soft backdrop-blur transition hover:-translate-y-[2px] hover:shadow-lg">
      <h3 className="text-lg font-semibold text-slate">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function ADLSubastasLanding() {
  return (
    <main className="relative min-h-screen bg-mist text-ink">
      <div className="absolute blur-accent -top-16 -left-10 h-72 w-72 bg-blue-200" aria-hidden />
      <div className="absolute blur-accent top-10 right-0 h-64 w-64 bg-indigo-200" aria-hidden />

      <section className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-16 md:px-10">
        {/* HERO */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Subastas · ADL Suite</p>
            <h1 className="text-4xl font-semibold leading-tight text-slate md:text-5xl">
              Subastas monitorizadas sin ruido ni avisos tardíos.
            </h1>
            <p className="text-lg text-slate-600 md:text-xl">
              Detecta subastas públicas a tiempo, con alertas priorizadas y contexto listo para decidir. Sin promesas
              vacías: foco en señales claras y trazables.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-slate px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-[2px] hover:shadow-lg"
                href="mailto:contact@adlsuite.com?subject=Subastas%20-%20Piloto"
              >
                Solicitar acceso al piloto
              </Link>
              <span className="rounded-full border border-slate/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Piloto privado
              </span>
            </div>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white/70 p-8 shadow-soft backdrop-blur">
            <div className="text-sm font-semibold text-slate-500">Qué resuelve</div>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                <p className="text-base font-semibold text-slate">Antes de que cierre la puja</p>
                <p className="mt-2 text-sm text-slate-600">
                  Avisos tempranos para preparar valoración, equipo y documentación sin trabajar contra el reloj.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                <p className="text-base font-semibold text-slate">Menos ruido, más decisiones</p>
                <p className="mt-2 text-sm text-slate-600">
                  Filtrado por importe, ubicación, estado y fechas; señales listas para pasar a due diligence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PROBLEM */}
        <section className="space-y-4">
          <SectionTitle eyebrow="Problem" title="Por qué se pierden subastas valiosas" />
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((item) => (
              <Card key={item.title} title={item.title} desc={item.desc} />
            ))}
          </div>
        </section>

        {/* SOLUTION */}
        <section className="space-y-4">
          <SectionTitle eyebrow="Solution" title="Cómo Subastas reduce ruido y retrasos" />
          <div className="grid gap-4 md:grid-cols-3">
            {solutions.map((item) => (
              <Card key={item.title} title={item.title} desc={item.desc} />
            ))}
          </div>
        </section>

        {/* KEY CAPABILITIES */}
        <section className="space-y-4">
          <SectionTitle eyebrow="Key Capabilities" title="Capacidades clave para operar con tiempo" />
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map((item) => (
              <Card key={item.title} title={item.title} desc={item.desc} />
            ))}
          </div>
        </section>

        {/* USE CASES */}
        <section className="space-y-4">
          <SectionTitle eyebrow="Use Cases" title="Dónde encaja mejor" />
          <div className="grid gap-4 md:grid-cols-2">
            {useCases.map((item) => (
              <Card key={item.title} title={item.title} desc={item.desc} />
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="space-y-4">
          <SectionTitle eyebrow="Trust" title="Operado sobre ADL Suite" />
          <div className="grid gap-4 md:grid-cols-3">
            {trust.map((item) => (
              <Card key={item.title} title={item.title} desc={item.desc} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-start gap-4 rounded-3xl border border-neutral-200 bg-slate text-white p-8 shadow-soft">
          <h3 className="text-2xl font-semibold">Conversemos sobre tu piloto</h3>
          <p className="text-base text-white/80 max-w-3xl">
            Te mostramos cómo operamos el monitoreo, filtrado y alertado de subastas para que evalúes con datos y sin
            promesas vacías.
          </p>
          <Link
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate transition hover:-translate-y-[2px] hover:shadow-lg"
            href="mailto:contact@adlsuite.com?subject=ADL%20Subastas%20-%20Piloto"
          >
            Solicitar acceso al piloto
          </Link>
        </section>
      </section>
    </main>
  );
}

