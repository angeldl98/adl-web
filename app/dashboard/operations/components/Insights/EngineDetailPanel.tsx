"use client";

import { useEffect, useState } from 'react';
import { EngineDetail } from './EngineDetail';
import { getEngineInsight } from '../../insightsLoaders';
import { getPredictEngine } from '../../predictLoaders';
import { EngineSelector } from '../EngineSelector';

type Props = {
  engines: string[];
  defaultEngine: string;
};

export function EngineDetailPanel({ engines, defaultEngine }: Props) {
  const [engine, setEngine] = useState(defaultEngine);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  const [prediction, setPrediction] = useState<any>();
  const [detailSource, setDetailSource] = useState<'live' | 'mock'>('mock');
  const [predSource, setPredSource] = useState<'live' | 'mock'>('mock');
  const [detailError, setDetailError] = useState<string | undefined>();
  const [predError, setPredError] = useState<string | undefined>();

  const load = async (name: string) => {
    setLoading(true);
    setDetailError(undefined);
    setPredError(undefined);
    const [d, p] = await Promise.all([getEngineInsight(name), getPredictEngine(name)]);
    if (!d.data && d.error) setDetailError(d.error);
    if (!p.data && p.error) setPredError(p.error);
    setDetail(d.data);
    setPrediction(p.data);
    setDetailSource(d.source);
    setPredSource(p.source);
    setLoading(false);
  };

  useEffect(() => {
    load(engine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine]);

  return (
    <EngineSelector engines={engines} defaultValue={engine} onChange={setEngine}>
      {loading ? (
        <div className="card"><p className="muted">Cargando detalle de engine...</p></div>
      ) : detail ? (
        <EngineDetail
          data={detail}
          prediction={prediction}
          source={detailSource}
          predictionSource={predSource}
          error={detailError}
          predictionError={predError}
        />
      ) : (
        <div className="card"><p className="error">No hay insights para este engine.</p></div>
      )}
    </EngineSelector>
  );
}


