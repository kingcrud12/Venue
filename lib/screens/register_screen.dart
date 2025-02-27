import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:flutter/gestures.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _termsAccepted = false;
  bool _isLoading = false;
  
  String _errorMessage = '';
  String _successMessage = '';

  bool _isValidEmail(String email) {
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    return emailRegex.hasMatch(email);
  }

  bool _isValidPassword(String password) {
    return password.length >= 8;
  }

  Future<void> _handleRegister() async {
    setState(() {
      _errorMessage = '';
      _successMessage = '';
      _isLoading = true;
    });

    final firstName = _firstNameController.text.trim();
    final lastName = _lastNameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    // ✅ Validation des champs
    if (firstName.isEmpty || lastName.isEmpty || email.isEmpty || password.isEmpty || confirmPassword.isEmpty) {
      setState(() {
        _errorMessage = 'Tous les champs sont obligatoires.';
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

    if (!_isValidPassword(password)) {
      setState(() {
        _errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
        _isLoading = false;
      });
      return;
    }

    if (password != confirmPassword) {
      setState(() {
        _errorMessage = 'Les mots de passe ne correspondent pas.';
        _isLoading = false;
      });
      return;
    }

    if (!_termsAccepted) {
      setState(() {
        _errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
        _isLoading = false;
      });
      return;
    }

    try {
      await Future.delayed(const Duration(seconds: 2));

      setState(() {
        _successMessage = 'Inscription réussie ! Redirection vers la connexion...';
      });

      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
      });
    } catch (error) {
      setState(() {
        _errorMessage = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _handleGoogleSignUp() {
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(
      content: Text("Inscription avec Google... (Backend à intégrer)"),
    ),
  );
}

  // ✅ Simulation d'une connexion avec Facebook
  void _handleFacebookSignUp() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Connexion avec Facebook... (Backend à intégrer)'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Inscription')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _firstNameController,
              decoration: const InputDecoration(labelText: 'Prénom', prefixIcon: Icon(Icons.person)),
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _lastNameController,
              decoration: const InputDecoration(labelText: 'Nom', prefixIcon: Icon(Icons.person_outline)),
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(labelText: 'Adresse email', prefixIcon: Icon(Icons.email)),
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _passwordController,
              obscureText: !_showPassword,
              decoration: InputDecoration(
                labelText: 'Mot de passe',
                prefixIcon: const Icon(Icons.lock),
                suffixIcon: IconButton(
                  icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility),
                  onPressed: () {
                    setState(() { _showPassword = !_showPassword; });
                  },
                ),
              ),
            ),

            const SizedBox(height: 8),


            // ✅ Indicateur de validation du mot de passe
            Row(
              children: [
                Icon(
                  _isValidPassword(_passwordController.text) ? Icons.check_circle : Icons.error,
                  color: _isValidPassword(_passwordController.text) ? Colors.green : Colors.red,
                ),
                const SizedBox(width: 8),
                Text(
                  '8 caractères minimum',
                  style: TextStyle(
                    color: _isValidPassword(_passwordController.text) ? Colors.green : Colors.red,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            TextField(
              controller: _confirmPasswordController,
              obscureText: !_showConfirmPassword,
              decoration: InputDecoration(
                labelText: 'Confirmer le mot de passe',
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(_showConfirmPassword ? Icons.visibility_off : Icons.visibility),
                  onPressed: () {
                    setState(() { _showConfirmPassword = !_showConfirmPassword; });
                  },
                ),
              ),
            ),
            
            

            const SizedBox(height: 16),

            CheckboxListTile(
              value: _termsAccepted,
              onChanged: (value) {
                setState(() {
                  _termsAccepted = value ?? false; // ✅ Mise à jour de l'état
                  });
                  },
                  title: RichText(
                    text: TextSpan(
                      text: "J'accepte les ",
                      style: const TextStyle(
                        color: Colors.black, // ✅ Texte normal en noir
                        fontSize: 14,
                        ),
                        children: [
                          TextSpan(
                            text: "conditions d'utilisation",
                            style: const TextStyle(
                              color: Color(0xFF4ECDC4), // ✅ Couleur personnalisée (turquoise)
                              fontWeight: FontWeight.bold,
                              ),
                              recognizer: TapGestureRecognizer()
                              ..onTap = () {
                                // ✅ Rediriger vers une page web ou une route interne
                                showDialog(
                                  context: context,
                                  builder: (context) => AlertDialog(
                                    title: const Text("Conditions d'utilisation"),
                                    content: const Text(
                                      "Ici, afficher vos conditions d'utilisation ou rediriger vers un lien externe.",
                                      ),
                                      actions: [
                                        TextButton(
                                          onPressed: () => Navigator.pop(context),
                                          child: const Text("Fermer"),
                                        ),
                                       ],
                                     ),
                                   );
                                  },
                               ),
                              ],
                             ),
                           ),
                          controlAffinity: ListTileControlAffinity.leading, // ✅ Case à gauche du texte
                          activeColor: const Color(0xFFFF6B6B), // ✅ Couleur lors du "check"
                        contentPadding: EdgeInsets.zero,
              ),


            const SizedBox(height: 8),
            

            SizedBox(
              width: double.infinity,
              child:ElevatedButton(
              onPressed: _isLoading ? null : _handleRegister, // Désactivé pendant le chargement
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('S\'inscrire'),
              ),
            ),

            const SizedBox(height: 16),

            if (_successMessage.isNotEmpty)
              Text(_successMessage, style: const TextStyle(color: Colors.green), textAlign: TextAlign.center),

            if (_errorMessage.isNotEmpty)
              Text(_errorMessage, style: const TextStyle(color: Colors.red), textAlign: TextAlign.center),

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

            SizedBox(
              width: double.infinity,
              child:OutlinedButton(
              onPressed: _handleGoogleSignUp, 
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),),
                child: Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                 SvgPicture.asset('assets/Google.svg',width: 20, height: 20 ),
                 const SizedBox(width: 50),
                const Text("Sinscrire avec Google"),
                ],
              ),
            ),
            ),

            const SizedBox(height: 12),

            // 🔹 Bouton "Se connecter avec Facebook"
            SizedBox(
              width: double.infinity,
              child:OutlinedButton(
              onPressed: _handleFacebookSignUp, 
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
                text:"Vous êtes déjà un compte ? ",
                style: const TextStyle(
                  color:Colors.black,
                  fontSize: 14,
                ),
                children: [
                  TextSpan(
                    text: "Se connecter",
                    style: const TextStyle(
                      color: Color(0xFF4ECDC4),
                      fontWeight:FontWeight.bold,
                    ),
                    recognizer: TapGestureRecognizer()
                      ..onTap = () {
                        Navigator.pushNamed(context, '/login');

                      },
                  )
                ]
              )
            )

          ],
        ),
      ),
    );
  }
}