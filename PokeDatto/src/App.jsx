import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MisJuegosPage from './pages/MisJuegosPage';
import PokedexPage from './pages/PokedexPage';
import ComparatorPage from './pages/ComparatorPage';
import ProfilePage from './pages/ProfilePage';
import ProgresoPage from './pages/ProgresoPage';
import AventurasPage from './pages/AventurasPage';
import GameAdventurePage from './pages/GameAdventurePage';
import JuegosPage from './pages/JuegosPage';
import ShinyHuntingPage from './pages/ShinyHuntingPage';
import EncountersPage from './pages/EncountersPage';
import GymLeadersPage from './pages/GymLeadersPage';
import PokemonLeaguePage from './pages/PokemonLeaguePage';
import AdminStatsPage from './pages/AdminStatsPage';
import DamageCalcPage from './pages/DamageCalcPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import ProtectedRoute from './components/ProtectedRoute';
import { SettingsProvider } from './contexts/SettingsContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <SettingsProvider>
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mis-juegos" element={<ProtectedRoute><MisJuegosPage /></ProtectedRoute>} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/comparador" element={<ComparatorPage />} />
          <Route path="/aventuras" element={<ProtectedRoute><AventurasPage /></ProtectedRoute>} />
          <Route path="/aventura" element={<ProtectedRoute><GameAdventurePage /></ProtectedRoute>} />
          <Route path="/juegos" element={<JuegosPage />} />
          <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/progreso" element={<ProtectedRoute><ProgresoPage /></ProtectedRoute>} />
          <Route path="/shiny-hunting" element={<ProtectedRoute><ShinyHuntingPage /></ProtectedRoute>} />
          <Route path="/encuentros" element={<ProtectedRoute><EncountersPage /></ProtectedRoute>} />
          <Route path="/lideres-gimnasio" element={<GymLeadersPage />} />
          <Route path="/liga-pokemon" element={<PokemonLeaguePage />} />
          <Route path="/calculadora-dano" element={<DamageCalcPage />} />
          <Route path="/team-builder" element={<ProtectedRoute><TeamBuilderPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminStatsPage />} />
        </Routes>
      </div>
    </Router>
    </SettingsProvider>
  );
}

export default App
