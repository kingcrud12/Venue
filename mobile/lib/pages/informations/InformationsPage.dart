import 'dart:math';

import 'package:Venue/models/UserData.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

Map<String, List<(String, IconData)>> parameters = {
  "Account": [
    ("Account", Icons.account_box_rounded),
    ("Privacy", Icons.key_rounded),
    ("Security & Permissions", Icons.safety_check),
  ],
  "Content & Display": [
    ("Notifications", Icons.notifications),
    ("Content preferences", Icons.restaurant),
    ("Audience controls", Icons.people),
    ("Ads", Icons.ads_click)
  ],
  "Visibility": [("Messages", Icons.messenger), ("Sharing", Icons.share_sharp)]
};

class InformationsPage extends StatelessWidget {
  const InformationsPage({super.key});
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    List<double> rows =
        [0, 0.08, 1 - 0.08, 1].map((e) => e * size.height).toList();
    List<double> columns =
        [0, 0.08, 1 - 0.08, 1].map((e) => e * size.width).toList();
    UserData userData = context.read<UserData>();

    return SizedBox(
      height: size.height,
      width: size.width,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.primaryContainer,
          leading: IconButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            icon: Icon(Icons.arrow_back),
          ),
        ),
        body: Stack(
          children: [
            FractionallySizedBox(
              widthFactor: 1,
              heightFactor: 1,
              child: Container(
                color: Theme.of(context).colorScheme.primaryContainer,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: ListView(
                children: [
                  Text(
                    "Settings",
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  for (String a in parameters.keys) ...{
                    Padding(
                      padding:
                          EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                      child: Text(
                        a,
                        style: Theme.of(context).textTheme.labelSmall,
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.onPrimary,
                        border: Border.all(
                          color: Theme.of(context).colorScheme.onPrimary,
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      padding:
                          EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      child: Stack(
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              for ((int, (String, IconData)) s
                                  in parameters[a]!.indexed) ...{
                                Row(spacing: 2.0, children: [
                                  Icon(
                                    s.$2.$2,
                                    size: 30,
                                    color: Theme.of(context)
                                        .colorScheme
                                        .primaryContainer,
                                  ),
                                  Text(
                                    s.$2.$1,
                                    style:
                                        Theme.of(context).textTheme.bodySmall,
                                  ),
                                ]),
                                //_TextFieldAnimatedContainer(),
                                if (s.$1 != parameters[a]!.length - 1)
                                  Divider(
                                    thickness: 4,
                                    color: Theme.of(context)
                                        .colorScheme
                                        .primaryContainer,
                                  ),
                              }
                            ],
                          ),
                        ],
                      ),
                    ),
                  }
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
