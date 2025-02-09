import 'package:flutter/foundation.dart';

typedef DataName = String;
typedef DataCategory = (String, List<(DataName, dynamic)>);

enum PrivacyRestriction {
  everyone("Everyone"),
  suggestedFriends("Suggested friends"),
  friends("Friends"),
  noOne("No one");

  final String label;
  const PrivacyRestriction(this.label);
}

class UserData with ChangeNotifier, DiagnosticableTreeMixin {
  List<DataCategory> data = [
    (
      "Account information",
      [
        ("Handle", "@dos_santos"),
        ("First Name", "Dos Santos"),
        ("Last Name", "Lorenzo"),
        ("Phone Number", " "),
        ("e-mail", "example@example.com"),
        ("Region", "Paris,France")
      ],
    ),
    (
      "Privacy",
      [
        ("Private Account", "False"),
        ("Comments", PrivacyRestriction.everyone),
        ("Direct messages", PrivacyRestriction.friends),
        ("Mentions", PrivacyRestriction.everyone),
        ("List of followers", PrivacyRestriction.everyone),
        ("List of following", PrivacyRestriction.everyone),
        ("Liked posts", PrivacyRestriction.everyone),
        ("Comments", PrivacyRestriction.everyone),
      ]
    )
  ]; // Sorted and classed by category
}
