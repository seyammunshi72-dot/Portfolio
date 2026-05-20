import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/firebase';
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error }: { error: Error }) {
  return (
    <div style={{ color: 'red', background: 'black', padding: '20px', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h2>Application Error</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '10px' }}>{error.stack}</pre>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
