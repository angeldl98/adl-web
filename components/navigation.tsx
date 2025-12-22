"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function Navigation() {
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-medium tracking-tight">
              ADL Suite
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <div
                className="relative"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Productos
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {isProductsOpen && (
                  <div className="absolute left-0 top-full pt-3">
                    <div className="w-[680px] rounded-lg border border-border bg-background p-8 shadow-2xl">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Intelligence & Orchestration
                          </div>
                          <Link
                            href="#brain"
                            className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                          >
                            <div className="text-base font-medium text-foreground">ADL Brain</div>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                              Private enterprise AI for analysis, planning and decision support
                            </p>
                          </Link>
                        </div>
                        <div>
                          <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Public Data & Opportunities
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="/subastas"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">Subastas</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Monitoring and analysis of public auctions
                              </p>
                            </Link>
                            <Link
                              href="#scraper"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">ADL Scraper Engine</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Large-scale structured public data ingestion
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div>
                          <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Risk & Solvency
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="#solvency"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">ADL Solvency</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Solvency analysis and scoring
                              </p>
                            </Link>
                            <Link
                              href="#risk"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">ADL Risk Engine</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Financial and operational risk evaluation
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div>
                          <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Markets & Trading
                          </div>
                          <div className="space-y-2">
                            <Link
                              href="#trading"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">ADL Trading Engine</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Algorithmic trading with full risk control
                              </p>
                            </Link>
                            <Link
                              href="#market-data"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">ADL Market Data</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Financial data infrastructure
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Infrastructure & Control
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href="#observability"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">ADL Observability</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Metrics, logs and ecosystem monitoring
                              </p>
                            </Link>
                            <Link
                              href="#automation"
                              className="group block rounded-md p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="text-base font-medium text-foreground">ADL Automation Core</div>
                              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                Process and workflow orchestration
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/subastas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Subastas
              </Link>
              <Link href="/pharma" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pharma
              </Link>
              <Link href="#solutions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Soluciones
              </Link>
              <Link
                href="#architecture"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Arquitectura
              </Link>
              <Link href="#resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors md:block"
            >
              Contacto
            </Link>
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{session.user?.email}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Salir
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline">
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

