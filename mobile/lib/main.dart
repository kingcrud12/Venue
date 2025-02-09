import 'package:Venue/models/UserData.dart';
import 'package:Venue/pages/HomePage.dart';
import 'package:Venue/pages/InformationsPage.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider.value(value: UserData(), child: const MyApp()),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Venue',
      initialRoute: "/informations",
      routes: {
        "/": (context) => HomePage(),
        "/informations": (context) => InformationsPage(),
      },
    );
  }
}
