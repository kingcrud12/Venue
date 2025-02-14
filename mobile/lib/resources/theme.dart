import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MaterialThemeProvider with ChangeNotifier, DiagnosticableTreeMixin {
  MaterialTheme materialTheme;
  bool lightMode;
  MaterialThemeProvider({required this.materialTheme, this.lightMode = true});
  ThemeData get defaultThemeData =>
      (lightMode) ? materialTheme.light() : materialTheme.dark();
  set mode(bool value) {
    lightMode = value;
    notifyListeners();
  }
}

class MaterialTheme {
  final TextTheme textTheme;

  const MaterialTheme(this.textTheme);

  static ColorScheme lightScheme() {
    return const ColorScheme(
      brightness: Brightness.light,
      primary: Color(0xff4c5c92),
      surfaceTint: Color(0xff4c5c92),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xffdbe1ff),
      onPrimaryContainer: Color(0xff334479),
      secondary: Color(0xff595e72),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xffdde1f9),
      onSecondaryContainer: Color(0xff414659),
      tertiary: Color(0xff745470),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xffffd6f7),
      onTertiaryContainer: Color(0xff5b3d57),
      error: Color(0xffba1a1a),
      onError: Color(0xffffffff),
      errorContainer: Color(0xffffdad6),
      onErrorContainer: Color(0xff93000a),
      surface: Color(0xfffaf8ff),
      onSurface: Color(0xff1a1b21),
      onSurfaceVariant: Color(0xff45464f),
      outline: Color(0xff767680),
      outlineVariant: Color(0xffc6c6d0),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff2f3036),
      inversePrimary: Color(0xffb5c4ff),
      primaryFixed: Color(0xffdbe1ff),
      onPrimaryFixed: Color(0xff01174b),
      primaryFixedDim: Color(0xffb5c4ff),
      onPrimaryFixedVariant: Color(0xff334479),
      secondaryFixed: Color(0xffdde1f9),
      onSecondaryFixed: Color(0xff161b2c),
      secondaryFixedDim: Color(0xffc1c5dd),
      onSecondaryFixedVariant: Color(0xff414659),
      tertiaryFixed: Color(0xffffd6f7),
      onTertiaryFixed: Color(0xff2b122a),
      tertiaryFixedDim: Color(0xffe2bbdb),
      onTertiaryFixedVariant: Color(0xff5b3d57),
      surfaceDim: Color(0xffdad9e0),
      surfaceBright: Color(0xfffaf8ff),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfff4f3fa),
      surfaceContainer: Color(0xffeeedf4),
      surfaceContainerHigh: Color(0xffe9e7ef),
      surfaceContainerHighest: Color(0xffe3e1e9),
    );
  }

  ThemeData light() {
    return theme(lightScheme());
  }

  static ColorScheme lightMediumContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.light,
      primary: Color(0xff223367),
      surfaceTint: Color(0xff4c5c92),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xff5a6ba2),
      onPrimaryContainer: Color(0xffffffff),
      secondary: Color(0xff313548),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xff686c81),
      onSecondaryContainer: Color(0xffffffff),
      tertiary: Color(0xff492d46),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xff84637f),
      onTertiaryContainer: Color(0xffffffff),
      error: Color(0xff740006),
      onError: Color(0xffffffff),
      errorContainer: Color(0xffcf2c27),
      onErrorContainer: Color(0xffffffff),
      surface: Color(0xfffaf8ff),
      onSurface: Color(0xff101116),
      onSurfaceVariant: Color(0xff34363e),
      outline: Color(0xff51525b),
      outlineVariant: Color(0xff6b6c75),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff2f3036),
      inversePrimary: Color(0xffb5c4ff),
      primaryFixed: Color(0xff5a6ba2),
      onPrimaryFixed: Color(0xffffffff),
      primaryFixedDim: Color(0xff425288),
      onPrimaryFixedVariant: Color(0xffffffff),
      secondaryFixed: Color(0xff686c81),
      onSecondaryFixed: Color(0xffffffff),
      secondaryFixedDim: Color(0xff4f5468),
      onSecondaryFixedVariant: Color(0xffffffff),
      tertiaryFixed: Color(0xff84637f),
      onTertiaryFixed: Color(0xffffffff),
      tertiaryFixedDim: Color(0xff6a4b66),
      onTertiaryFixedVariant: Color(0xffffffff),
      surfaceDim: Color(0xffc7c6cd),
      surfaceBright: Color(0xfffaf8ff),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfff4f3fa),
      surfaceContainer: Color(0xffe9e7ef),
      surfaceContainerHigh: Color(0xffdddce3),
      surfaceContainerHighest: Color(0xffd2d1d8),
    );
  }

  ThemeData lightMediumContrast() {
    return theme(lightMediumContrastScheme());
  }

  static ColorScheme lightHighContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.light,
      primary: Color(0xff17295c),
      surfaceTint: Color(0xff4c5c92),
      onPrimary: Color(0xffffffff),
      primaryContainer: Color(0xff36477b),
      onPrimaryContainer: Color(0xffffffff),
      secondary: Color(0xff272b3d),
      onSecondary: Color(0xffffffff),
      secondaryContainer: Color(0xff44485c),
      onSecondaryContainer: Color(0xffffffff),
      tertiary: Color(0xff3e233c),
      onTertiary: Color(0xffffffff),
      tertiaryContainer: Color(0xff5d3f5a),
      onTertiaryContainer: Color(0xffffffff),
      error: Color(0xff600004),
      onError: Color(0xffffffff),
      errorContainer: Color(0xff98000a),
      onErrorContainer: Color(0xffffffff),
      surface: Color(0xfffaf8ff),
      onSurface: Color(0xff000000),
      onSurfaceVariant: Color(0xff000000),
      outline: Color(0xff2a2c34),
      outlineVariant: Color(0xff474951),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xff2f3036),
      inversePrimary: Color(0xffb5c4ff),
      primaryFixed: Color(0xff36477b),
      onPrimaryFixed: Color(0xffffffff),
      primaryFixedDim: Color(0xff1e3063),
      onPrimaryFixedVariant: Color(0xffffffff),
      secondaryFixed: Color(0xff44485c),
      onSecondaryFixed: Color(0xffffffff),
      secondaryFixedDim: Color(0xff2d3244),
      onSecondaryFixedVariant: Color(0xffffffff),
      tertiaryFixed: Color(0xff5d3f5a),
      onTertiaryFixed: Color(0xffffffff),
      tertiaryFixedDim: Color(0xff452943),
      onTertiaryFixedVariant: Color(0xffffffff),
      surfaceDim: Color(0xffb9b8bf),
      surfaceBright: Color(0xfffaf8ff),
      surfaceContainerLowest: Color(0xffffffff),
      surfaceContainerLow: Color(0xfff1f0f7),
      surfaceContainer: Color(0xffe3e1e9),
      surfaceContainerHigh: Color(0xffd5d3db),
      surfaceContainerHighest: Color(0xffc7c6cd),
    );
  }

  ThemeData lightHighContrast() {
    return theme(lightHighContrastScheme());
  }

  static ColorScheme darkScheme() {
    return const ColorScheme(
      brightness: Brightness.dark,
      primary: Color(0xffb5c4ff),
      surfaceTint: Color(0xffb5c4ff),
      onPrimary: Color(0xff1b2d61),
      primaryContainer: Color(0xff334479),
      onPrimaryContainer: Color(0xffdbe1ff),
      secondary: Color(0xffc1c5dd),
      onSecondary: Color(0xff2b3042),
      secondaryContainer: Color(0xff414659),
      onSecondaryContainer: Color(0xffdde1f9),
      tertiary: Color(0xffe2bbdb),
      onTertiary: Color(0xff422740),
      tertiaryContainer: Color(0xff5b3d57),
      onTertiaryContainer: Color(0xffffd6f7),
      error: Color(0xffffb4ab),
      onError: Color(0xff690005),
      errorContainer: Color(0xff93000a),
      onErrorContainer: Color(0xffffdad6),
      surface: Color(0xff121318),
      onSurface: Color(0xffe3e1e9),
      onSurfaceVariant: Color(0xffc6c6d0),
      outline: Color(0xff8f909a),
      outlineVariant: Color(0xff45464f),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffe3e1e9),
      inversePrimary: Color(0xff4c5c92),
      primaryFixed: Color(0xffdbe1ff),
      onPrimaryFixed: Color(0xff01174b),
      primaryFixedDim: Color(0xffb5c4ff),
      onPrimaryFixedVariant: Color(0xff334479),
      secondaryFixed: Color(0xffdde1f9),
      onSecondaryFixed: Color(0xff161b2c),
      secondaryFixedDim: Color(0xffc1c5dd),
      onSecondaryFixedVariant: Color(0xff414659),
      tertiaryFixed: Color(0xffffd6f7),
      onTertiaryFixed: Color(0xff2b122a),
      tertiaryFixedDim: Color(0xffe2bbdb),
      onTertiaryFixedVariant: Color(0xff5b3d57),
      surfaceDim: Color(0xff121318),
      surfaceBright: Color(0xff38393f),
      surfaceContainerLowest: Color(0xff0d0e13),
      surfaceContainerLow: Color(0xff1a1b21),
      surfaceContainer: Color(0xff1e1f25),
      surfaceContainerHigh: Color(0xff292a2f),
      surfaceContainerHighest: Color(0xff34343a),
    );
  }

  ThemeData dark() {
    return theme(darkScheme());
  }

  static ColorScheme darkMediumContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.dark,
      primary: Color(0xffd3dbff),
      surfaceTint: Color(0xffb5c4ff),
      onPrimary: Color(0xff0f2255),
      primaryContainer: Color(0xff7e8fc8),
      onPrimaryContainer: Color(0xff000000),
      secondary: Color(0xffd7dbf3),
      onSecondary: Color(0xff202536),
      secondaryContainer: Color(0xff8b90a5),
      onSecondaryContainer: Color(0xff000000),
      tertiary: Color(0xfff9d0f1),
      onTertiary: Color(0xff371c35),
      tertiaryContainer: Color(0xffaa86a4),
      onTertiaryContainer: Color(0xff000000),
      error: Color(0xffffd2cc),
      onError: Color(0xff540003),
      errorContainer: Color(0xffff5449),
      onErrorContainer: Color(0xff000000),
      surface: Color(0xff121318),
      onSurface: Color(0xffffffff),
      onSurfaceVariant: Color(0xffdcdbe6),
      outline: Color(0xffb1b1bb),
      outlineVariant: Color(0xff8f9099),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffe3e1e9),
      inversePrimary: Color(0xff35457a),
      primaryFixed: Color(0xffdbe1ff),
      onPrimaryFixed: Color(0xff000d36),
      primaryFixedDim: Color(0xffb5c4ff),
      onPrimaryFixedVariant: Color(0xff223367),
      secondaryFixed: Color(0xffdde1f9),
      onSecondaryFixed: Color(0xff0b1021),
      secondaryFixedDim: Color(0xffc1c5dd),
      onSecondaryFixedVariant: Color(0xff313548),
      tertiaryFixed: Color(0xffffd6f7),
      onTertiaryFixed: Color(0xff20071f),
      tertiaryFixedDim: Color(0xffe2bbdb),
      onTertiaryFixedVariant: Color(0xff492d46),
      surfaceDim: Color(0xff121318),
      surfaceBright: Color(0xff43444a),
      surfaceContainerLowest: Color(0xff06070c),
      surfaceContainerLow: Color(0xff1c1d23),
      surfaceContainer: Color(0xff27282d),
      surfaceContainerHigh: Color(0xff313238),
      surfaceContainerHighest: Color(0xff3d3d43),
    );
  }

  ThemeData darkMediumContrast() {
    return theme(darkMediumContrastScheme());
  }

  static ColorScheme darkHighContrastScheme() {
    return const ColorScheme(
      brightness: Brightness.dark,
      primary: Color(0xffeeefff),
      surfaceTint: Color(0xffb5c4ff),
      onPrimary: Color(0xff000000),
      primaryContainer: Color(0xffb0c0fd),
      onPrimaryContainer: Color(0xff000829),
      secondary: Color(0xffeeefff),
      onSecondary: Color(0xff000000),
      secondaryContainer: Color(0xffbdc2d9),
      onSecondaryContainer: Color(0xff060a1b),
      tertiary: Color(0xffffeaf8),
      onTertiary: Color(0xff000000),
      tertiaryContainer: Color(0xffdeb7d7),
      onTertiaryContainer: Color(0xff190319),
      error: Color(0xffffece9),
      onError: Color(0xff000000),
      errorContainer: Color(0xffffaea4),
      onErrorContainer: Color(0xff220001),
      surface: Color(0xff121318),
      onSurface: Color(0xffffffff),
      onSurfaceVariant: Color(0xffffffff),
      outline: Color(0xffefeffa),
      outlineVariant: Color(0xffc2c2cc),
      shadow: Color(0xff000000),
      scrim: Color(0xff000000),
      inverseSurface: Color(0xffe3e1e9),
      inversePrimary: Color(0xff35457a),
      primaryFixed: Color(0xffdbe1ff),
      onPrimaryFixed: Color(0xff000000),
      primaryFixedDim: Color(0xffb5c4ff),
      onPrimaryFixedVariant: Color(0xff000d36),
      secondaryFixed: Color(0xffdde1f9),
      onSecondaryFixed: Color(0xff000000),
      secondaryFixedDim: Color(0xffc1c5dd),
      onSecondaryFixedVariant: Color(0xff0b1021),
      tertiaryFixed: Color(0xffffd6f7),
      onTertiaryFixed: Color(0xff000000),
      tertiaryFixedDim: Color(0xffe2bbdb),
      onTertiaryFixedVariant: Color(0xff20071f),
      surfaceDim: Color(0xff121318),
      surfaceBright: Color(0xff4f5056),
      surfaceContainerLowest: Color(0xff000000),
      surfaceContainerLow: Color(0xff1e1f25),
      surfaceContainer: Color(0xff2f3036),
      surfaceContainerHigh: Color(0xff3a3b41),
      surfaceContainerHighest: Color(0xff46464c),
    );
  }

  ThemeData darkHighContrast() {
    return theme(darkHighContrastScheme());
  }

  ThemeData theme(ColorScheme colorScheme) => ThemeData(
        useMaterial3: true,
        brightness: colorScheme.brightness,
        colorScheme: colorScheme,
        textTheme: textTheme.apply(
          bodyColor: colorScheme.onSurface,
          displayColor: colorScheme.onSurface,
        ),
        scaffoldBackgroundColor: colorScheme.surface,
        canvasColor: colorScheme.surface,
      );

  List<ExtendedColor> get extendedColors => [];
}

class ExtendedColor {
  final Color seed, value;
  final ColorFamily light;
  final ColorFamily lightHighContrast;
  final ColorFamily lightMediumContrast;
  final ColorFamily dark;
  final ColorFamily darkHighContrast;
  final ColorFamily darkMediumContrast;

  const ExtendedColor({
    required this.seed,
    required this.value,
    required this.light,
    required this.lightHighContrast,
    required this.lightMediumContrast,
    required this.dark,
    required this.darkHighContrast,
    required this.darkMediumContrast,
  });
}

class ColorFamily {
  const ColorFamily({
    required this.color,
    required this.onColor,
    required this.colorContainer,
    required this.onColorContainer,
  });

  final Color color;
  final Color onColor;
  final Color colorContainer;
  final Color onColorContainer;
}

TextTheme createMaterialTextTheme(TextTheme? baseTextTheme) {
  TextTheme bodyTextTheme = GoogleFonts.abrilFatfaceTextTheme(baseTextTheme);
  TextTheme displayTextTheme = GoogleFonts.aDLaMDisplayTextTheme(baseTextTheme);
  TextTheme textTheme = displayTextTheme.copyWith(
    headlineLarge: displayTextTheme.headlineLarge,
    headlineMedium: displayTextTheme.headlineMedium,
    headlineSmall: displayTextTheme.headlineSmall,
    bodyLarge: bodyTextTheme.bodyLarge,
    bodyMedium: bodyTextTheme.bodyMedium,
    bodySmall: bodyTextTheme.bodySmall,
    labelLarge: bodyTextTheme.labelLarge,
    labelMedium: bodyTextTheme.labelMedium,
    labelSmall: bodyTextTheme.labelSmall,
  );
  return textTheme;
}

MaterialThemeProvider getDefaultMaterialTheme() {
  return MaterialThemeProvider(
      materialTheme: MaterialTheme(
    createMaterialTextTheme(null),
  ));
}
