/**
 * Desktop-only, e o gate vem antes de tudo (§4 e §27).
 *
 * A experiência principal só é importada depois que a largura passa no teste.
 * Numa viewport pequena nada da obra chega a ser baixado.
 */

import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import MobileGate from './ui/MobileGate';

const Experience = lazy(() => import('./ui/Experience'));
/** Bancada de validação dos registros (§3). Fora da obra, carregada só sob demanda. */
const ValidarRegistros = lazy(() => import('./ui/ValidarRegistros'));

const MIN_WIDTH = 1024;

export default function App(): JSX.Element {
  const [wide, setWide] = useState(() => window.innerWidth >= MIN_WIDTH);
  const validando = useMemo(
    () => new URLSearchParams(window.location.search).get('validar') === 'registros',
    [],
  );

  useEffect(() => {
    const onResize = (): void => setWide(window.innerWidth >= MIN_WIDTH);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (validando) {
    return (
      <Suspense fallback={<div className="carregando" aria-hidden="true" />}>
        <ValidarRegistros />
      </Suspense>
    );
  }

  if (!wide) return <MobileGate />;

  return (
    <Suspense fallback={<div className="carregando" aria-hidden="true" />}>
      <Experience />
    </Suspense>
  );
}
