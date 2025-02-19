import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';  // Import de la page de connexion
import ForgotPassword from './pages/ForgotPassword'; // Import de la page de mot de passe oublié
import Register from './pages/Register'; // Import de la page d'inscription
import Home from './pages/Home'; // Import de la page d'accueil
import ResetPassword from './pages/ResetPassword'; // Import de la page de réinitialisation du mot de passe

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page de connexion */}
        <Route path="/"  element={<Home />} />
        <Route path="/login" element={<Login />} />
         {/* Route pour la page de mot de passe oublié */}
         <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/register" element={<Register />} />
         <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}
