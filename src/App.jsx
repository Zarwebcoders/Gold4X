import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Investment from './pages/Investment';
import Income from './pages/Income';
import ReferralNetwork from './pages/ReferralNetwork';
import TeamAnalytics from './pages/TeamAnalytics';
import AutopoolBots from './pages/AutopoolBots';
import RankSystem from './pages/RankSystem';
import G4XWallet from './pages/G4XWallet';
import Transactions from './pages/Transactions';
import Support from './pages/Support';

import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />

        {/* Protected Routes wrapped in Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/investment" element={<Investment />} />
              <Route path="/income" element={<Income />} />
              <Route path="/reffralincome" element={<ReferralNetwork />} />
              <Route path="/team" element={<TeamAnalytics />} />
              <Route path="/autopool" element={<AutopoolBots />} />
              <Route path="/rank" element={<RankSystem />} />
              <Route path="/wallet" element={<G4XWallet />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<div className="p-10 text-center text-gray-400">Page under construction</div>} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
