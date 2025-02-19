import  {useState} from 'react';
import { useNavigate } from 'react-router-dom';  // Pour rediriger après connexion
import styles from './Register.module.css';
import Google from '../assets/Google.svg';
import Facebook from '../assets/Facebook.svg';
import EyeIcon from '../assets/Eye.svg';
import EyeOffIcon from '../assets/EyeSlash.svg';

const API_URL = 'http://localhost:3000';    // URL de l'API

export default function Register() {

     const [showPassword, setShowPassword] = useState(false);
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [termsAccepted, setTermsAccepted] = useState(false);
     const [error, setError] = useState('');
     const [successMessage, setSuccessMessage] = useState('');
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate(); // Déclaration de navigate pour la redirection

     const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);  // Fonction de validation d'email

     const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('Veuillez remplir tous les champs.');
            return;
        }   

        if (!isValidEmail(email)) {
            setError('Adresse email invalide');
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

        if (!termsAccepted) {
            setError('Veuillez accepter les conditions d\'utilisation.');
            return;
        }

        try {
            setLoading(true);
            
            const response = await fetch(`${API_URL}/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json(); // Conversion de la réponse en JSON

            if (response.ok) {
                setSuccessMessage('Inscription réussie !');
                setTimeout(() => navigate('/login'), 3000); // Redirige vers la page de connexion après 3 secondes

            } else {
                setError(data.message || 'Une erreur est survenue.');
            }

        } catch (error) {
            console.error('Erreur d\'inscription :', error);
            setError('Une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            setLoading(false);
        }
     };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.card}`}>
        <h1>Inscription</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="firstName" className={styles.label}>Prénom</label>
          <input 
          type="text" 
          id="firstName" 
          name="firstName" 
          placeholder="Prénom" 
          className={`input ${styles.input}`} 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          required 
          />

          <label htmlFor="lastName" className={styles.label}>Nom</label>
          <input 
          type="text" 
          id="lastName" 
          name="lastName" 
          placeholder="Nom" 
          className={`input ${styles.input}`} 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required 
          />

          <label htmlFor="email" className={styles.label}>Adresse Email</label>
          <input 
          type="email" 
          id="email" 
          name="email" 
          placeholder="Email" 
          className={`input ${styles.input}`}
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
          />

          <label htmlFor="password" className={styles.label}>Mot de passe</label>
          <div className={styles.passwordContainer}>
                      <input
                      type={showPassword ? 'text' : 'password'} // Affiche le mot de passe si showPassword est vrai
                      id="password"
                      name="password"
                      placeholder="Mot de passe"
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

            {/* Case à cocher pour les conditions d'utilisateur */}
            <div className={styles.checkboxContainer}>
                <input
                type="checkbox"
                id="terms"
                name="terms"
                className={`checkbox ${styles.checkbox}`}
                checked={termsAccepted} 
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
                />
                <label htmlFor='terms' className={styles.checkboxLabel}>
                    J&#39;accepte les <a href="/" className={styles.termsLink}>conditions d&#39;utilisation</a>
                </label>
            </div>

          <button type="submit" className={`button button--primary ${styles.button}`} disabled={loading}>
            {loading ? 'inscription en cours...' : 'S\'inscrire'}</button>
           {/* Affichage du message de succès ou d'erreur */}
        {successMessage && <p className={styles.success} role='status'>{successMessage}</p>}
        {error && <p className={styles.error} role='alert'>{error}</p>}

        </form>

        <div className={styles.divider}>
            <span className={styles.fontDivider}>ou</span>
        </div>
        
        <div className={styles.socialLoginContainer}>
            <button className={`button button--secondary ${styles.socialButton}`}>
                <img src={Google} alt="Google" className={styles.icon} />S&#39;inscrire avec Google
            </button>
            <button className={`button button--secondary ${styles.socialButton}`}>
                <img src={Facebook} alt="Facebook" className={styles.icon}/>S&#39;inscrire avec Facebook
            </button>
        </div>

        <div className={styles.signUpContainer}>
            <span>Vous avez déjà un compte?</span>
            <a href="/Login" className={styles.signUpLink}> Se connecter</a>
        </div>
      </div>
    </div>
  );
}