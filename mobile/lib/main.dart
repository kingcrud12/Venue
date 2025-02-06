import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'resources/color.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    List<(String, Color)> colors = [
      ("primary", primaryColor),
      ("secondary", secondaryColor),
      ("background", backgroundColor),
      ("surface", surfaceColor),
      ("textPrimary", textPrimaryColor),
      ("textSecondary", textSecondaryColor),
      ("success", successColor),
      ("warning", warningColor),
      ("error", errorColor),
      ("info", infoColor),
    ];
    return MaterialApp(
      title: 'Konnekt',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: primaryColor),
        useMaterial3: true,
      ),
      home: Scaffold(
        body: Column(children: [
          for ((String, Color) l in colors)
            Stack(children: [
              SizedBox(
                height: MediaQuery.sizeOf(context).height / colors.length,
                width: MediaQuery.sizeOf(context).width,
                child: ColoredBox(color: l.$2),
              ),
              Positioned(
                left: MediaQuery.sizeOf(context).width / 2,
                child: Text(
                  l.$1,
                ),
              ),
            ]),
        ]),
      ),
    );
  }
}
