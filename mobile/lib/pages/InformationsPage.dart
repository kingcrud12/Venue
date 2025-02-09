import 'package:Venue/models/UserData.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class InformationsPage extends StatelessWidget {
  const InformationsPage({super.key});
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    List<double> rows =
        [0, 0.1, 1 - 0.1, 1].map((e) => e * size.height).toList();
    List<double> columns =
        [0, 0.1, 1 - 0.1, 1].map((e) => e * size.width).toList();
    UserData userData = context.read<UserData>();
    return Scaffold(
      body: SizedBox(
        height: size.height,
        width: size.width,
        child: Stack(
          children: [
            for (double d in columns)
              Positioned(
                left: d,
                child: SizedBox(
                  height: size.height,
                  width: 1,
                  child: ColoredBox(
                    color: Colors.blue,
                  ),
                ),
              ),
            for (double d in rows)
              Positioned(
                top: d,
                child: SizedBox(
                  width: size.width,
                  height: 1,
                  child: ColoredBox(
                    color: Colors.red,
                  ),
                ),
              ),
            Positioned(
              top: rows[1],
              left: columns[1],
              child: SizedBox(
                height: rows[2] - rows[1],
                width: columns[2] - columns[1],
                child: ListView(
                  children: [
                    for ((String, List<(String, dynamic)>) category
                        in userData.data) ...{
                      Text(
                        category.$1,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      for ((String, dynamic) d in category.$2)
                        TextField(
                          controller:
                              TextEditingController(text: d.$2.toString()),
                          decoration: InputDecoration(labelText: d.$1),
                        ),
                    },
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
