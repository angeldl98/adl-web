export async function safeFetchJSON<T = any>(url: string, opts: { timeoutMs?: number; defaultValue?: T } = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 4000);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`status_${res.status}`);
    const data = (await res.json()) as T;
    return data;
  } catch (err) {
    if (opts.defaultValue !== undefined) return opts.defaultValue;
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export function formatDate(value?: string | number | Date) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return `${value}`;
  }
}

