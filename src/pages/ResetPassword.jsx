import  {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';  // Pour rediriger après connexion
import styles from './ResetPassword.module.css';
import EyeIcon from '../assets/Eye.svg';
import EyeOffIcon from '../assets/EyeSlash.svg';
import { useSearchParams } from 'react-router-dom';


const API_URL = 'http://localhost:3000';    // URL de l'API

export default function ResetPassword() {

     const [showPassword, setShowPassword] = useState(false);
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [error, setError] = useState('');
     const [successMessage, setSuccessMessage] = useState('');
     const [loading, setLoading] = useState(false);
     const [searchParams] = useSearchParams(); // Récupère les paramètres de l'URL
     const [isTokenValid, setIsTokenValid] = useState(false); // État pour vérifier si le token est valide
     const Navigate = useNavigate(); // Déclaration de navigate pour la redirection

     // Récupère le token de réinitialisation de mot de passe depuis les paramètres de l'URL
     const token = searchParams.get('token');

     // Vérifie si le token est présent dans l'URL
     useEffect(() => {
        if (!token) {
            setError('Token manquant. Redirection...');
            setIsTokenValid(false);
            setTimeout(() => Navigate('/login'), 3000); // Redirige vers la page de connexion après 3 secondes
        }
    }, [token, Navigate]); 

     const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!password || !confirmPassword) {
            setError('Veuillez remplir tous les champs.')
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        // Vérifie si les mots de passe correspondent
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, token }),
            });

            const data = await response.json(); // Conversion de la réponse en JSON

            if (response.ok) {
                setSuccessMessage('Votre mot de passe a été réinitialisé avec succès.');
                setTimeout(() => Navigate('/login'), 3000); // Redirige vers la page de connexion après 3 secondes

            } else {
                setError(data.message || 'Une erreur est survenue.');
            }

        } catch (error) {
            console.error('Erreur de réinitialisation du mot de passe :', error);
            setError ('Une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
        }; 
       if (!isTokenValid)  return null; // Si le token n'est pas valide, ne rien afficher

  return (
    <div className={styles.container}>
      <div className={`card ${styles.card}`}>
        <h1 className={styles.titre}>Réinitialisation du mot de passe</h1>
        <form className={styles.form} onSubmit={handleSubmit}>   
          <label htmlFor="password" className={styles.label}>Mot de passe</label>
          <div className={styles.passwordContainer}>
                      <input
                      type={showPassword ? 'text' : 'password'} // Affiche le mot de passe si showPassword est vrai
                      id="password"
                      name="password"
                      placeholder="Entrer un nouveau mot de passe"
                      className={`input ${styles.input}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      />
                      <img
                        src={showPassword ? EyeOffIcon : EyeIcon}
                        alt={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}  // Bascule l'affichage
                      />
                    </div>
          

          <label htmlFor="confirmPassword" className={styles.label}>Confirmer le mot de passe</label>
          <div className={styles.passwordContainer}>
                      <input
                      type={showPassword ? 'text' : 'password'} // Affiche le mot de passe si showPassword est vrai
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirmer le mot de passe"
                      className={`input ${styles.input}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      />
                      <img
                        src={showPassword ? EyeOffIcon : EyeIcon}
                        alt={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}  // Bascule l'affichage
                      />
                    </div>

          <button type="submit" className={`button button--primary ${styles.button}`} disabled={loading}>{loading ? 'Chargement...' :'Réinitialiser le mot de passe'}</button>
          {/* Affichage du message de succès ou d'erreur */}
          {successMessage && <p className={styles.success} role='status'>{successMessage}</p>}
           {error && <p className={styles.error} role='alert'>{error.replace(/</g, '&lt;')}</p>}
        </form>
      </div>
    </div>
  );
}