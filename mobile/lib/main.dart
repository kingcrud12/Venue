import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/forgot_password_screen.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Auth App',
      debugShowCheckedModeBanner: false, // Supprime le bandeau "Debug" en haut à droite

      // 🎨 Définition du thème global avec un ColorScheme personnalisé
      theme: ThemeData(
        colorScheme: ColorScheme.light(
          primary: const Color(0xFFFF6B6B), // 🔴 Rouge corail pour les boutons et éléments principaux
          secondary: const Color(0xFF4ECDC4), // 🔵 Turquoise pour les accents
          surface: const Color(0xFFFFFFFF), // 🎭 Fond des cartes et composants
          error: const Color(0xFFE74C3C), // ⚠️ Rouge pour les erreurs
          onPrimary: Colors.white, // 🎨 Texte sur fond `primary` (ex: bouton principal)
          onSecondary: Colors.white, // 🎨 Texte sur fond `secondary`
          onSurface: const Color(0xFF6C757D), // 🎨 Texte secondaire
        ),

        // 🌍 Fond global de l'application
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),

        // 🖋 Définition de la police d'écriture principale
        fontFamily: 'Poppins',

         // 📝 Définition du texte principal et secondaire
        textTheme: const TextTheme(
          bodyLarge: TextStyle(fontSize: 18, color: Color(0xFF212529)), // 📝 Texte principal
          bodyMedium: TextStyle(fontSize: 16, color: Color(0xFF6C757D)), // 📝 Texte secondaire
        ),


        // 🎨 Personnalisation des boutons
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFF6B6B), // 🔴 Couleur par défaut des boutons
            foregroundColor: Colors.white, // 🖋 Couleur du texte sur les boutons
            padding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 24.0),
            textStyle: const TextStyle(fontSize: 16.0, fontWeight: FontWeight.w600, fontFamily: 'Inter', ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8.0),
            ),
          ),
        ),

        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
          foregroundColor: const Color(0xFFFF6B6B), // 🖋 Texte en rouge corail (Primary)
          side: const BorderSide(color: Color(0xFFFF6B6B), width: 1.0), // 📏 Bordure de 1px en `primary`
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 24.0), // 📏 Adaptation de la charte
          textStyle: const TextStyle(
            fontSize: 16.0,
            fontWeight: FontWeight.w600,
            fontFamily: 'Inter',
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8.0), // 🎨 Bord arrondi 8px
          ),
        ),
      ),

        // 🎨 Personnalisation des champs de texte
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFF8F9FA), // 🏷️ Fond des champs de texte
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8.0),
            borderSide: const BorderSide(color: Color(0xFFF8F9FA), width: 1.0),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8.0),
            borderSide: const BorderSide(color: Color.fromARGB(255, 209, 210, 212), width: 1.0),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8.0),
            borderSide: const BorderSide(color: Color(0xFF4ECDC4), width: 2.0),
          ),
          contentPadding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0), // 📏 Padding respecté
          labelStyle: const TextStyle(color: Color(0xFF212529), fontSize: 16),

          suffixIconColor: Colors.grey,
        ),
      ),

      // 🛣️ Gestion des routes de l'application
      initialRoute: '/login', // 🚀 Première page affichée (Connexion)
      routes: {
        '/login': (context) => const LoginScreen(), // 🔑 Route vers la page de connexion
        '/register': (context) => const RegisterScreen(), // ✍️ Route vers l'inscription
        '/forgot-password': (context) => const ForgotPasswordScreen(), // 🔑 Réinitialisation de mot de passe
        '/home': (context) => const HomeScreen(), // 🏠 Page d'accueil après connexion
      },
    );
  }
}