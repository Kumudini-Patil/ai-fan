import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Chatbot from './components/Chatbot';

// Pages
import PremiumHomePage from './pages/PremiumHomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MatchesPage from './pages/MatchesPage';
import MatchDetailPage from './pages/MatchDetailPage';
import GenerateTeamPage from './pages/GenerateTeamPage';
import MyTeamsPage from './pages/MyTeamsPage';
import StatsPage from './pages/StatsPage';
import AdminDashboard from './pages/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PremiumHomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/generate-team/:matchId" element={<GenerateTeamPage />} />
            <Route path="/stats" element={<StatsPage />} />

            {/* Protected Routes */}
            <Route path="/my-teams" element={<MyTeamsPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Legacy /teams route redirects to /my-teams */}
            <Route path="/teams/:id" element={<MyTeamsPage />} />
          </Routes>
          <Chatbot />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
