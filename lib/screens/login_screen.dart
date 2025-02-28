import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter/gestures.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false; // ✅ Gère l'état de chargement
  String _errorMessage = ''; // ✅ Gestion des erreurs
  String _emailError = ''; // ✅ Message d'erreur pour l'email
  String _passwordError = ''; // ✅ M
  bool _rememberMe = false;

  bool _showPassword = false;

  // ✅ Vérification d'un email valide
  bool _isValidEmail(String email) {
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    return emailRegex.hasMatch(email);
  }

  Future<void> _handleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
      _emailError = '';
      _passwordError = '';
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty) {
      setState(() {
        _emailError = 'L\'email est obligatoire.';
        _isLoading = false;
      });
      return;
    }

    if (!_isValidEmail(email)) {
      setState(() {
        _errorMessage = 'Adresse email invalide.';
        _isLoading = false;
      });
      return;
    }

    if (password.isEmpty) {
      setState(() {
        _passwordError = 'Le mot de passe est obligatoire.';
        _isLoading = false;
      });
      return;
    }


    // ✅ Simule un appel API (à remplacer par un vrai appel)
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return; // ✅ Vérifie si le widget est toujours actif avant d'utiliser `context`

    setState(() {
      _isLoading = false;
    });

    // ✅ Affichage d'un message temporaire pour tester
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Email: $email, Mot de passe: $password'),
      ),
    );
  }

  // ✅ Simulation d'une connexion avec Google
  void _handleGoogleLogin() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Connexion avec Google... (Backend à intégrer)'),
      ),
    );
  }

   // ✅ Simulation d'une connexion avec Facebook
  void _handleFacebookLogin() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Connexion avec Facebook... (Backend à intégrer)'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connexion'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child:SingleChildScrollView(child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // ✅ `TextField` avec styles hérités du `main.dart`
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration:  InputDecoration(
                labelText: 'Adresse email',
                prefixIcon: Icon(Icons.email),
                errorText: _emailError.isNotEmpty ? _emailError : null, 
              ),
            ),
            const SizedBox(height: 16),

            // ✅ Champ Mot de Passe avec icône pour afficher/masquer
            TextField(
              controller: _passwordController,
              obscureText: !_showPassword, // ✅ Masque ou affiche le texte
              decoration: InputDecoration(
                labelText: 'Mot de passe',
                prefixIcon: const Icon(Icons.lock),
                suffixIcon: IconButton(
                  icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility),
                  onPressed: () {
                    setState(() {
                      _showPassword = !_showPassword; // ✅ Change l'état à chaque clic
                    });
                  },
                ),
                errorText: _passwordError.isNotEmpty ? _passwordError : null, 
              ),
            ),

           const SizedBox(height: 16),

            CheckboxListTile(
              value : _rememberMe,
              onChanged: (value) {
                setState(() {
                   _rememberMe = value ?? false; // ✅ Mise à jour de l'état
                });
              },
              title: const Text(
                "Se souvenir de moi",
                style: TextStyle(
                  color:Colors.black,
                  fontSize: 14,
                  
                ),
              ),
              controlAffinity: ListTileControlAffinity.leading, // ✅ Place la case à gauche du texte
              activeColor: const Color(0xFFFF6B6B), // ✅ Couleur au moment du "check"
              contentPadding: EdgeInsets.zero,
            ),


            const SizedBox(height: 8),

            // ✅ Affichage des erreurs
            if (_errorMessage.isNotEmpty)
              Text(
                _errorMessage,
                style: const TextStyle(color: Colors.red),
                textAlign: TextAlign.center,
              ),

            const SizedBox(height: 16),

            // ✅ `ElevatedButton` avec styles hérités du `main.dart`
            SizedBox(
              width: double.infinity,
              child:ElevatedButton(
              onPressed: _isLoading ? null : _handleLogin, // Désactivé pendant le chargement
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Se connecter'),
              ),
            ),
            
            const SizedBox(height: 16),

            TextButton(
              onPressed: () {
                Navigator.pushNamed(context, '/forgot-password');
              },
              style: TextButton.styleFrom(
                foregroundColor: const Color(0xFF4ECDC4), 
              ),
              
              child: const Text(
                'Mot de passe oublié ?',
              style: TextStyle(fontWeight: FontWeight.bold,
              ),
              ),
            ),

            const SizedBox(height: 16),

            // ✅ Ligne de séparation avec "OU"
            Row(
              children: [
                const Expanded(child: Divider(thickness: 1, color: Colors.grey)),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: Text(
                    'ou',
                    style: TextStyle(color: Colors.grey[600], fontWeight: FontWeight.normal),
                  ),
                ),
                const Expanded(child: Divider(thickness: 1, color: Colors.grey)),
              ],
            ),

            const SizedBox(height: 16),

            // 🔹 Bouton "Se connecter avec Google"
            SizedBox(
              width: double.infinity,
              child:OutlinedButton(
              onPressed: _handleGoogleLogin, 
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),),
                child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                 SvgPicture.asset('assets/Google.svg',width: 20, height: 20 ),
                 const SizedBox(width: 50),
                const Text("Se connecter avec Google"),
                ],
              ),
            ),
            ),
            
            const SizedBox(height: 12),

           // 🔹 Bouton "Se connecter avec Facebook"
            SizedBox(
              width: double.infinity,
              child:OutlinedButton(
              onPressed: _handleFacebookLogin, 
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),),
                child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                 SvgPicture.asset('assets/Facebook.svg',width: 20, height: 20 ),
                 const SizedBox(width: 50),
                const Text("Se connecter avec Facebook"),
                ],
              ),
            ),
            ),
            
            const SizedBox(height: 16),

            RichText(
              textAlign: TextAlign.center,
              text:TextSpan(
                text:"Vous n'êtes pas inscrit ? ",
                style: const TextStyle(
                  color:Colors.black,
                  fontSize: 14,
                ),
                children: [
                  TextSpan(
                    text: "S'inscrire",
                    style: const TextStyle(
                      color: Color(0xFF4ECDC4),
                      fontWeight:FontWeight.bold,
                    ),
                    recognizer: TapGestureRecognizer()
                      ..onTap = () {
                        Navigator.pushNamed(context, '/register');

                      },
                  )
                ]
              )
            )


          ],
        ),
      ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}