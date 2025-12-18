import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './pages/Auth';
import OwnerDashboard from './pages/OwnerDashboard';
import EngineerDashboard from './pages/EngineerDashboard';
function App() {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/register" element={<Auth />} />


        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
