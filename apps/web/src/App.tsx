import { demoFirearms } from './data/demoFirearms';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">RackTrack</h1>

      {demoFirearms.length === 0 && (
        <p className="text-slate-400">No firearms yet.</p>
      )}

      <ul className="space-y-2">
        {demoFirearms.map((f) => (
          <li key={f.id} className="rounded border border-slate-800 p-3">
            <span className="font-medium">{f.name}</span>
            <span className="text-slate-400"> — {f.caliber}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
