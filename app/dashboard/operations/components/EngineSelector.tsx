"use client";

import { useEffect, useState } from 'react';

type Props = {
  engines: string[];
  defaultValue: string;
  onChange?: (engine: string) => void;
  children?: React.ReactNode | ((engine: string) => React.ReactNode);
};

export function EngineSelector({ engines, defaultValue, children }: Props) {
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    if (engines.length && !engines.includes(selected)) {
      setSelected(engines[0]);
    }
  }, [engines, selected]);

  return (
    <div className="stack gap-12">
      <div className="flex gap-8" style={{ alignItems: 'center' }}>
        <label className="muted">Engine</label>
        <select className="input" value={selected} onChange={e => setSelected(e.target.value)}>
          {engines.length === 0 && <option value={defaultValue}>{defaultValue}</option>}
          {engines.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>
      {children && (
        <div>
          {typeof children === 'function' ? children(selected) : children}
        </div>
      )}
    </div>
  );
}


