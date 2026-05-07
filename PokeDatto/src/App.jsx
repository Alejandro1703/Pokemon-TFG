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
          <Route path="/mis-juegos" element={<MisJuegosPage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/comparador" element={<ComparatorPage />} />
          <Route path="/aventuras" element={<AventurasPage />} />
          <Route path="/aventura" element={<GameAdventurePage />} />
          <Route path="/juegos" element={<JuegosPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/progreso" element={<ProgresoPage />} />
        </Routes>
      </div>
    </Router>
    </SettingsProvider>
  );
}

export default App
