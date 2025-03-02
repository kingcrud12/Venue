import 'package:Venue/view_models/user_data_view_model.dart';
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
                                if (s.$2.$1 == "Account") AccountForm(),
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

class AccountForm extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => AccountFormState();
}

class AccountFormState extends State<AccountForm> {
  String selectedDate = "";
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          onChanged: (value) =>
              context.read<UserDataViewModel>().update(username: value),
          style: Theme.of(context).textTheme.bodySmall,
          decoration: InputDecoration(labelText: "Username"),
        ),
        TextField(
          onChanged: (value) =>
              context.read<UserDataViewModel>().update(name: value),
          style: Theme.of(context).textTheme.bodySmall,
          decoration: InputDecoration(labelText: "Name"),
        ),
        Row(spacing: 20, children: [
          Text(selectedDate),
          ElevatedButton.icon(
            icon: const Icon(Icons.calendar_today),
            onPressed: () async {
              DateTime? pickedDate = await showDatePicker(
                context: context,
                initialEntryMode: DatePickerEntryMode.calendarOnly,
                initialDate: DateTime.now(),
                firstDate: DateTime(2019),
                lastDate: DateTime(2050),
              );

              if (pickedDate is DateTime) {
                context.read<UserDataViewModel>().update(birthday: pickedDate);
                setState(() {
                  selectedDate =
                      "${pickedDate.day}/${pickedDate.month}/${pickedDate.year}";
                });
              }
            },
            label: const Text('Choose birthday'),
          )
        ]),
        TextField(
          onChanged: (value) =>
              context.read<UserDataViewModel>().update(phoneNumber: value),
          style: Theme.of(context).textTheme.bodySmall,
          decoration: InputDecoration(labelText: "Phone number"),
          keyboardType: TextInputType.phone,
        ),
      ],
    );
  }
}
