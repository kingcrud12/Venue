import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Bienvenue sur la page d&#39;accueil</h1>
      <p>Choisissez une action ci-dessous :</p>

      <nav className={styles.navigation}>
        <ul>
          <li>
            <Link to="/login">Connexion</Link>
          </li>
          <li>
            <Link to="/forgot-password">Mot de passe oublié</Link>
          </li>
          <li>
            <Link to="/register">Inscription</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
