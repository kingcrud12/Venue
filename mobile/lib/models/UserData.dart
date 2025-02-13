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

UserData getDefaultSession() {
  return UserData(
      username: "@username",
      name: "",
      birthday: DateTime(1900, 1, 1),
      phoneNumber: "",
      email: "",
      language: "FR",
      profileImagePath: "");
}

class UserData with ChangeNotifier, DiagnosticableTreeMixin {
// Sorted and classed by category
  DateTime birthday;
  String email;
  String language;
  String name;
  String phoneNumber;
  String profileImagePath;
  String username;
  UserData(
      {required this.username,
      required this.name,
      required this.birthday,
      required this.phoneNumber,
      required this.email,
      required this.language,
      required this.profileImagePath});
}
