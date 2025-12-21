import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Detail } from "./types";
import { SubastaDetailClient } from "./client";

async function fetchDetail(id: string): Promise<Detail | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const r = await fetch(`${base}/api/subastas-proxy/${id}`, { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    return j.data;
  } catch (err) {
    console.error("fetchDetail subasta error", err);
    return null;
  }
}

export default async function SubastaDetailPage({ params }: { params: Promise<{ idSub: string }> }) {
  const { idSub } = await params;
  const detail = await fetchDetail(idSub);
  const safeDetail =
    detail && {
      ...detail,
      detail_status: detail.detail_status || "UNKNOWN",
      detail_error_code: detail.detail_error_code || null,
      detail_last_attempt_at: detail.detail_last_attempt_at || null,
      // @ts-ignore - backend might not send attempts; default to 0
      detail_attempts: (detail as any).detail_attempts ?? 0,
    };

  if (!safeDetail) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-lg font-medium">Subasta no encontrada.</p>
          <Link href="/subastas" className="text-primary underline mt-4 inline-block">
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <SubastaDetailClient detail={safeDetail} />
      </div>
    </div>
  );
}
