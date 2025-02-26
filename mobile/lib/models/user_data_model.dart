class UserDataModel {
  DateTime birthday;
  String email;
  String language;
  String name;
  String phoneNumber;
  String profileImagePath;
  String username;
  UserDataModel(
      {required this.username,
      required this.name,
      required this.birthday,
      required this.phoneNumber,
      required this.email,
      required this.language,
      required this.profileImagePath});
}
