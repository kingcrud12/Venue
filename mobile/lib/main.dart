import 'package:Venue/models/UserData.dart';
import 'package:Venue/pages/HomePage.dart';
import 'package:Venue/pages/informations/InformationsPage.dart';
import 'package:Venue/resources/theme.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider.value(
      value: getDefaultSession(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: MaterialTheme(
        createMaterialTextTheme(
            Theme.of(context).textTheme.apply(fontSizeFactor: 1.8)),
      ).light(),
      title: 'Venue',
      initialRoute: "/informations",
      routes: {
        "/": (context) => HomePage(),
        "/informations": (context) => InformationsPage(),
      },
    );
  }
}
