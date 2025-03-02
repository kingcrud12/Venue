import 'package:flutter/material.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  _ForgotPasswordScreenState createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final TextEditingController _emailController = TextEditingController();
  String _errorMessage = '';
  String _successMessage = '';
  bool _isLoading = false; 

  bool _isValidEmail(String email) {
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    return emailRegex.hasMatch(email);
  }

  Future<void> _handleSubmit() async {
    setState(() {
      _errorMessage = '';
      _successMessage = '';
      _isLoading = true;
    });

    final email = _emailController.text.trim();

    if (!_isValidEmail(email)) {
      setState(() {
        _errorMessage = 'Adresse email invalide.';
        _isLoading = false;
      });
      return;
    }

    try {
      // ✅ Simule un appel API (à remplacer par un vrai appel)
      await Future.delayed(const Duration(seconds: 2));

      setState(() {
        _successMessage = 'Un lien de réinitialisation a été envoyé à votre adresse email.';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mot de passe oublié'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),

            // ✅ `TextField` utilisant les styles globaux
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Adresse email',
                prefixIcon: Icon(Icons.email),
              ),
            ),

            const SizedBox(height: 16),

            // ✅ `ElevatedButton` utilisant les styles globaux
            ElevatedButton(
              onPressed: _isLoading ? null : _handleSubmit,
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text("Envoyer le lien"),
            ),

            const SizedBox(height: 16),

            // ✅ Gestion des messages d'erreur et de succès
            if (_successMessage.isNotEmpty)
              Text(
                _successMessage,
                style: const TextStyle(color: Colors.green),
                textAlign: TextAlign.center,
              ),
            if (_errorMessage.isNotEmpty)
              Text(
                _errorMessage,
                style: const TextStyle(color: Colors.red),
                textAlign: TextAlign.center,
              ),
          ],
        ),
      ),
    );
  }
}