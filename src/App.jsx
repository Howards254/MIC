import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthProvider from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import InnovatorsPage from './pages/InnovatorsPage';
import InvestorsPage from './pages/InvestorsPage';
import JobsPage from './pages/JobsPage';
import ExploreProjectsPage from './pages/ExploreProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/innovators" element={<InnovatorsPage />} />
              <Route path="/investors" element={<InvestorsPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/explore" element={<ExploreProjectsPage />} />
              <Route path="/project/:id" element={<ProjectDetailPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
