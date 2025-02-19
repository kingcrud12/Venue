import { useState } from 'react';
import styles from './ForgotPassword.module.css';

const API_URL = 'http://localhost:3000'; // URL de l'API

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);  // Validation stricte de l'email


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!isValidEmail(email)) { // Validation de l'email
            setError('Adresse email invalide');
            return;
        }

        try {
            setLoading(true);
            
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Un lien de réiitialisation a été envoyé à votre adresse email.');
            }else {
                setError(data.message || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.error('Erreur de réinitialisation du mot passe :', error);
            setError('Une erreur est survenue. Veuillez réessayer plus tard.'); 
        } finally {
            setLoading(false);} // Désactive le chargement
    };
  return (
    <div className={styles.container}>
      <div className={`card ${styles.card}`}>
        <h1>Mot de passe oublié</h1>
        <p className={styles.description}>
          Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
        </p>
        <form className={styles.form} onSubmit = {handleSubmit}>
          <label htmlFor="email" className={styles.label}>Adresse Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className={`input ${styles.input}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254} // Limite le nombre de caractères à 254
            required
          />
          <button type="submit" className={`button button--primary ${styles.button}`} disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        {/* Affichage du message de succès ou d'erreur */}
        {message && <p className={styles.success} role='status'>{message}</p>}
        {error && <p className={styles.error} role='alert'>{error.replace(/</g, '&lt;')}</p>}


        <div className={styles.backContainer}>
          <a href="/Login" className={styles.backLink}>Retour à la connexion</a>
        </div>
      </div>
    </div>
  );
}