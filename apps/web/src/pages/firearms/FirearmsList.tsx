import { PageHeader } from '@racktrack/ui';
import { demoFirearms } from '../../data/demo';

export function FirearmsList() {
  return (
    <>
      <PageHeader title="Firearms" subtitle="All registered firearms." />
      <ul className="space-y-2">
        {demoFirearms.map((f) => (
          <li key={f.id} className="rounded border border-slate-800 p-3">
            <span className="font-medium text-slate-100">{f.name}</span>
            <span className="text-slate-400"> — {f.caliber}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
