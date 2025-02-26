import 'package:Venue/models/user_data_model.dart';
import 'package:flutter/material.dart';

class UserDataViewModel extends ChangeNotifier {
  UserDataModel data;
  UserDataViewModel(this.data);

  void updateUsername(String s) {
    data.username = s;
    notifyListeners();
  }

  void update(
      {String? username,
      String? name,
      DateTime? birthday,
      String? phoneNumber,
      String? email,
      String? language,
      String? profileImagePath}) {
    String result = "";
    if (username is String) {
      data.username = username;
      result += "Username : $username";
    }
    if (name is String) {
      data.name = name;
      result += "Name : $name";
    }
    if (birthday is DateTime) {
      data.birthday = birthday;
      result += "Birthday : ${birthday.toString()}";
    }
    if (phoneNumber is String) {
      data.phoneNumber = phoneNumber;
      result += "Phone Number : $phoneNumber";
    }
    if (email is String) {
      data.email = email;
      result += "Email : $email";
    }
    if (language is String) {
      data.language = language;
      result += "Language : $language";
    }
    if (profileImagePath is String) {
      data.profileImagePath = profileImagePath;
      result += "Image Path : $profileImagePath";
    }
    print("User Data View model updated with $result");

    notifyListeners();
  }
}

UserDataViewModel getDefaultSession() {
  return UserDataViewModel(
    UserDataModel(
        username: "@username",
        name: "",
        birthday: DateTime(1900, 1, 1),
        phoneNumber: "",
        email: "",
        language: "FR",
        profileImagePath: ""),
  );
}
