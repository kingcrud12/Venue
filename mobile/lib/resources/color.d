import 'package:flutter/material.dart';
/* Couleurs principales */
Color primaryColor = Color() #FF6B6B; /* Rouge-corail - Action principale */
-secondary: #4ECDC4; /* Turquoise - Accents */

/* Neutres */
-background: #FFFFFF; /* Fond principal */
-surface: #F8F9FA; /* Fond secondaire */
-text-primary: #212529;
-text-secondary: #6C757D;

/* États */
-success: #2ECC71;
-warning: #FFC107;
-error: #E74C3C;
-info: #3498DB;

/* Gradients */
-gradient-primary: linear-gradient(45deg, #FF6B6B, #FF8E53);

/* Typographie */
-font-primary: 'Poppins', sans-serif;
-font-secondary: 'Inter', sans-serif;

/* Tailles de texte */
-text-xs: 0.75rem; /* 12px */
-text-sm: 0.875rem; /* 14px */
-text-base: 1rem; /* 16px */
-text-lg: 1.125rem; /* 18px */
-text-xl: 1.25rem; /* 20px */
-text-2xl: 1.5rem; /* 24px */

/* Système d'espacement */
-space-xs: 0.25rem; /* 4px */
-space-sm: 0.5rem; /* 8px */
-space-md: 1rem; /* 16px */
-space-lg: 1.5rem; /* 24px */
-space-xl: 2rem; /* 32px */

/* Composants */
.button {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

.button--primary {
  background: var(--primary);
  color: white;
}

.button--secondary {
  background: var(--surface);
  color: var(--primary);
  border: 1px solid var(--primary);
}

.card {
  border-radius: 12px;
  background: var(--background);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: var(--space-md);
}

.input {
  border-radius: 8px;
  border: 1px solid var(--surface);
  padding: 12px 16px;
  font-size: var(--text-base);
}

.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

/* Animations */
.transition-base {
  transition: all 0.3s ease;
}

.hover-scale {
  transform: scale(1.02);
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface) 25%,
    var(--background) 50%,
    var(--surface) 75%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s infinite;
}

/* Breakpoints */
-mobile: 320px;
-tablet: 768px;
-desktop: 1024px;
-large: 1440px;

/* Media queries */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}