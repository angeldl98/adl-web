import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-5xl font-medium tracking-tight text-foreground lg:text-7xl text-balance">ADL Suite</h1>
          <p className="mt-4 text-2xl text-foreground/80 font-light tracking-tight lg:text-3xl text-balance">
            Infraestructura inteligente para operar con datos, riesgo y decisiones reales
          </p>
          <p className="mt-8 text-xl text-muted-foreground leading-relaxed text-pretty lg:text-2xl">
            ADL Suite es un ecosistema empresarial diseñado para recopilar, analizar y transformar datos complejos en
            decisiones accionables, de forma automatizada, trazable y bajo control.
          </p>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Desde datos públicos y financieros hasta trading algorítmico, solvencia y análisis de riesgo, ADL Suite
            conecta todos los sistemas necesarios para operar sin ruido ni improvisación.
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="text-base">
              Contactar
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Ver productos
            </Button>
          </div>
        </div>
      </section>

        <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-3xl">
            <p className="text-3xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
              La mayoría de empresas no tienen un problema de datos.
              <br />
              Tienen un problema de sistemas desconectados.
            </p>
            <div className="mt-16 space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>Hoy, la información crítica está repartida entre:</p>
              <ul className="space-y-3 pl-6">
                <li>→ fuentes públicas difíciles de seguir</li>
                <li>→ procesos manuales lentos</li>
                <li>→ herramientas aisladas</li>
                <li>→ decisiones basadas en intuición o retrasos</li>
              </ul>
              <p className="mt-8">
                Esto provoca oportunidades perdidas, riesgo mal evaluado, costes ocultos y falta de trazabilidad real.
              </p>
              <p className="mt-4 text-foreground font-medium">
                ADL Suite nace para ordenar, automatizar y gobernar todo ese flujo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-medium text-muted-foreground">Qué es ADL Suite</h2>
            <p className="mt-6 text-3xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
              Un sistema central para operar con datos y decisiones
            </p>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed lg:text-xl">
              ADL Suite no es una herramienta aislada.
              <br />
              Es una infraestructura unificada que conecta datos, análisis, automatización, ejecución y trazabilidad en
              un solo ecosistema operativo.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-medium text-muted-foreground">Cómo funciona</h2>
            <p className="mt-6 text-3xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
              De los datos a la decisión, sin saltos
            </p>
            <div className="mt-16 space-y-12">
              <div>
                <div className="text-sm font-medium text-muted-foreground">01</div>
                <h3 className="mt-4 text-2xl font-medium text-foreground">Ingesta de datos</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Recopilación continua de datos públicos, financieros y operativos.
                </p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">02</div>
                <h3 className="mt-4 text-2xl font-medium text-foreground">Normalización y análisis</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Estructuración, scoring, filtros y modelos adaptados a cada caso.
                </p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">03</div>
                <h3 className="mt-4 text-2xl font-medium text-foreground">Ejecución automatizada</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Alertas, acciones y flujos definidos por reglas claras.
                </p>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">04</div>
                <h3 className="mt-4 text-2xl font-medium text-foreground">Trazabilidad y control</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Cada ejecución queda registrada: cuándo, por qué y con qué resultado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-medium text-muted-foreground">El ecosistema</h2>
            <p className="mt-6 text-3xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
              Productos diseñados para trabajar juntos
            </p>
            <div className="mt-16 space-y-12 text-lg text-muted-foreground leading-relaxed">
              <p>
                El ecosistema ADL Suite cubre todo el ciclo: desde la captura de información pública y privada hasta el
                análisis de riesgo, la toma de decisiones automatizada y la ejecución controlada de operaciones.
              </p>
              <p>
                Cada producto está diseñado para resolver un problema específico, pero todos comparten la misma
                infraestructura, datos y lógica de control, permitiendo flujos de trabajo complejos sin fricciones.
              </p>
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-foreground">Intelligence & Orchestration</div>
                  <p className="mt-2 text-base">IA empresarial privada y orquestación de procesos</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Public Data & Opportunities</div>
                  <p className="mt-2 text-base">Monitoreo y análisis de datos públicos estructurados</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Risk & Solvency</div>
                  <p className="mt-2 text-base">Evaluación de solvencia y análisis de riesgo financiero</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Markets & Trading</div>
                  <p className="mt-2 text-base">Trading algorítmico con control de riesgo integrado</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Infrastructure & Control</div>
                  <p className="mt-2 text-base">Observabilidad, métricas y automatización central</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-medium text-muted-foreground">Para quién es</h2>
            <p className="mt-6 text-3xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
              Diseñado para operar, no para experimentar
            </p>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed lg:text-xl">
              ADL Suite está pensado para empresas, inversores y equipos que trabajan con datos complejos, riesgo
              financiero u operaciones críticas.
            </p>
            <p className="mt-6 text-lg text-foreground font-medium">
              No es una plataforma genérica.
              <br />
              Es una infraestructura para quien toma decisiones reales.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-48">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-base font-medium text-muted-foreground">Confianza y confiabilidad</h2>
            <p className="mt-6 text-3xl font-medium tracking-tight text-foreground lg:text-5xl text-balance">
              Sin promesas vacías. Sin cajas negras.
            </p>
            <div className="mt-16 space-y-8">
              <div>
                <h3 className="text-lg font-medium text-foreground">Fuentes públicas y verificables</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Todos los datos públicos provienen de fuentes oficiales y auditables. No inventamos información, la
                  capturamos y estructuramos.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Procesos trazables y auditables</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Cada decisión automatizada queda registrada con su lógica, contexto y resultado. Sin opacidad.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Automatización controlada</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Los sistemas no toman decisiones por su cuenta. Ejecutan reglas claras definidas por quien controla el
                  riesgo.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Arquitectura modular y escalable</h3>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Cada producto puede usarse de forma independiente o integrarse completamente. Sin dependencias
                  forzadas.
                </p>
              </div>
              <p className="mt-12 text-lg text-foreground font-medium">Construido para producción, no para demos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-foreground">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-medium tracking-tight text-background lg:text-6xl text-balance">
              Empieza a operar con control real
            </h2>
            <p className="mt-6 text-lg text-background/70 leading-relaxed lg:text-xl">
              Si tu negocio depende de datos, riesgo o decisiones críticas, ADL Suite puede ayudarte a estructurarlo
              todo bajo una sola infraestructura.
            </p>
            <div className="mt-12">
              <Button size="lg" variant="secondary" className="text-base">
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            <div>
              <div className="text-lg font-medium">ADL Suite</div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Infraestructura inteligente para operar con datos, riesgo y decisiones reales.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Productos</div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#brain" className="hover:text-foreground transition-colors">
                    ADL Brain
                  </Link>
                </li>
                <li>
                  <Link href="/subastas" className="hover:text-foreground transition-colors">
                    Subastas
                  </Link>
                </li>
                <li>
                  <Link href="#trading" className="hover:text-foreground transition-colors">
                    ADL Trading Engine
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Ver todos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Recursos</div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Arquitectura
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Casos de uso
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Empresa</div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 ADL Suite. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
