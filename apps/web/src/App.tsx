import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import {
  AmmoInventory,
  AmmoTypes,
  Dashboard,
  FirearmForm,
  FirearmsList,
  LogSession,
  MaintenanceHistory,
  MaintenanceSchedule,
  RoundsHistory,
} from './routes/pages';

// The app lives under a path on GitHub Pages (see `base` in vite.config.ts), so
// the router needs the same prefix, minus the trailing slash.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/firearms" element={<FirearmsList />} />
          <Route path="/firearms/new" element={<FirearmForm />} />

          <Route path="/rounds" element={<RoundsHistory />} />
          <Route path="/rounds/new" element={<LogSession />} />

          <Route path="/maintenance" element={<MaintenanceSchedule />} />
          <Route path="/maintenance/history" element={<MaintenanceHistory />} />

          <Route path="/ammo" element={<AmmoInventory />} />
          <Route path="/ammo/types" element={<AmmoTypes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
