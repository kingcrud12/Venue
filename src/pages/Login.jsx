import  {useState} from 'react';
import { useNavigate } from 'react-router-dom';  // Pour rediriger après connexion
import styles from './Login.module.css';
import Google from '../assets/Google.svg';
import Facebook from '../assets/Facebook.svg';
import EyeIcon from '../assets/Eye.svg';
import EyeOffIcon from '../assets/EyeSlash.svg';

const API_URL = 'http://localhost:3000';    // URL de l'API

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);  // État pour le mot de passe visible ou non
    
    {/* Déclaration des variables d'état pour les champs de saisie */}
    const [email, setEmail] = useState('');  // email est initialisé à une chaîne de caractères vide
    const [password, setPassword] = useState(''); // password est initialisé à une chaîne de caractères vide
    const [error, setError] = useState(''); // error est initialisé à une chaîne de caractères vide
    const [loading, setLoading] = useState(false); // loading est initialisé à false
    const navigate = useNavigate();  // Déclaration de navigate pour la redirection

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);  // Fonction de validation d'email

    const handleError = (message) => {
        setError(message); // Met à jour l'état d'erreur avec le message fourni
        setLoading(false); // Désactive le chargement
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError( ''); // Réinitialiser l'état des erreurs
    
        // Validation de l'email
    if (!isValidEmail(email)) {
        handleError('Adresse email invalide');
        return;
      }

    try {
        setLoading(true);
        // Envoi d'une requête POST à l'API pour tenter une connexion
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST', // Méthode HTTP utilisée (POST pour envoyer des données)
          headers: {
            'Content-Type': 'application/json', // Indique que les données envoyées sont au format JSON
          },
          body: JSON.stringify({ email, password}), // Transformation des données en format JSON
        });
            // Conversion de la réponse en JSON pour pouvoir l'exploiter
        const data = await response.json();
        
   // Vérifie si la requête a réussi (statut HTTP 200-299)
        if (response.ok) {
          alert("Connexion réussie !"); // Affichage d'une alerte de succès
  
          // Stocke le token JWT dans le localStorage pour l'authentification future
          localStorage.setItem('token', data.token);
  
          // Redirige l'utilisateur vers la page d'accueil après la connexion
          navigate('/');
        } else {
            handleError(data.message || 'une erreur est survenue.'); // Affiche le message d'erreur de l'API
        }
      } catch (error) {
        // Gestion des erreurs en cas de problème réseau ou d'erreur inattendue
        console.error("Erreur de connexion:", error);
  
        // Mise à jour de l'état d'erreur avec un message générique
        handleError(
           "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
        );  
      }
    };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.card}`}>
        <h1>Connexion</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
           {/* Champ de saisie pour l'email */}
           <label htmlFor="email" className={styles.label}>Adresse email</label> 
           <input
           type="email"
           id="email"
           name="email"
           placeholder="Entrez votre email"
           className={`input ${styles.input}`}
           value={email} // La valeur du champ est liée à la variable d'état email
           onChange={(e) => setEmail(e.target.value)} // Met à jour la variable d'état email lorsqu'un changement est détecté
           required 
           />

            {/* Champ de saisie pour le mot de passe */}
            <label htmlFor="password" className={styles.label}>Mot de passe</label>
            <div className={styles.passwordContainer}>
            <input
            type={showPassword ? 'text' : 'password'} // Affiche le mot de passe si showPassword est vrai
            id="password"
            name="password"
            placeholder="Entrez votre mot de passe"
            className={`input ${styles.input}`}
            value={password} // La valeur du champ est liée à la variable d'état password
            onChange={(e) => setPassword(e.target.value)} // Met à jour la variable d'état password lorsqu'un changement est détecté
            required
            />
            <img
              src={showPassword ? EyeOffIcon : EyeIcon}
              alt={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} // Accessibilité
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}  // Bascule l'affichage
            />
          </div>

            {/* Case à cocher pour se souvenir de l'utilisateur */}
            <div className={styles.checkboxContainer}>
                <input
                type="checkbox"
                id="remember"
                name="remember"
                className={`checkbox ${styles.checkbox}`} 
                />
                <label htmlFor='remember' className={styles.checkboxLabel}>
                    Se souvenir de moi
                </label>
            </div>

            {error && <p className={styles.error} role='alert'>{error.replace(/</g, '&lt;')}</p>}

            
            {/* Bouton de connexion */}
            <button type="submit" className={`button button--primary ${styles.button}`} disabled={loading}>
                {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            {/* Lien pour réinitialiser le mot de passe */}
            <div className={styles.linkContainer}>
                <a href="/forgot-password" className={styles.link}>
                    Mot de passe oublié ?
                </a>
            </div>
        </form>

        {/* Séparation visuelle */}
        <div className={styles.divider}>
            <span className={styles.fontDivider}>ou</span>
        </div>

        
        {/* Boutons de connexion avec Google et Facebook */}
        <div className={styles.socialLoginContainer}>
            <button className={`button button--secondary ${styles.socialButton}`}>
            <img src={Google} alt="Google" className={styles.icon} />Se connecter avec Google
            </button>
            <button className={`button button--secondary ${styles.socialButton}`}>
                <img src={Facebook} alt="Facebook" className={styles.icon}/>Se connecter avec Facebook
            </button>
        </div>

        {/* Lien d'inscription */}
        <div className={styles.signUpContainer}>
            <span>Vous n&#39;avez pas de compte?</span>
            <a href="/register" className={styles.signUpLink}> S&#39;inscrire</a>
        </div>
      </div>
    </div>
  );
}
       