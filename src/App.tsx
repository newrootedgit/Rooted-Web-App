import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MachinesPage } from '@machines/MachinesPage';
import { PlannerPage } from '@planner/PlannerPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/machines" replace />} />
        <Route path="/machines" element={<MachinesPage />} />
        <Route path="/planner" element={<PlannerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
