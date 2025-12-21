import { safeFetchJSON } from '../../../lib/fetcher';
import ScriptRunner from './runner';

async function fetchScripts() {
  const list = await safeFetchJSON<any>('http://core-adlscript:4213/script/list', { defaultValue: { scripts: [] } });
  return list.scripts || [];
}

export default async function ScriptsPage() {
  const scripts = await fetchScripts();
  return (
    <div className="stack gap-16">
      <div className="section-title">
        <h1 className="title">ADL-SCRIPT</h1>
        <p className="muted">Scripts registrados y ejecución manual.</p>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Versión</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {scripts.map((s: any) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.version}</td>
                <td>{s.description}</td>
                <td><ScriptRunner id={s.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

