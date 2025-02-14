import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    return Scaffold(
      body: SizedBox(
        height: size.height,
        width: size.width,
        child: Column(
          children: [
            Text("headline Large",
                style: Theme.of(context).textTheme.headlineLarge),
            Text("headline Medium",
                style: Theme.of(context).textTheme.headlineMedium),
            Text("headline Small",
                style: Theme.of(context).textTheme.headlineSmall),
            Text("Title Large", style: Theme.of(context).textTheme.titleLarge),
            Text("Title Medium",
                style: Theme.of(context).textTheme.titleMedium),
            Text("Title Small", style: Theme.of(context).textTheme.titleSmall),
            Text("body Large", style: Theme.of(context).textTheme.bodyLarge),
            Text("body Medium", style: Theme.of(context).textTheme.bodyMedium),
            Text("body Small", style: Theme.of(context).textTheme.bodySmall),
            Text("label Large", style: Theme.of(context).textTheme.labelLarge),
            Text("label Medium",
                style: Theme.of(context).textTheme.labelMedium),
            Text("label Small", style: Theme.of(context).textTheme.labelSmall),
          ],
        ),
      ),
    );
  }
}
