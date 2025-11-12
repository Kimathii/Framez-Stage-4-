// app.config.ts
export default {
  expo: {
    name: "Framez",
    slug: "framez",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark", // Changed to dark
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000" // Changed to black
    },
    updates: {
      url: "https://u.expo.dev/bb176fef-733c-4258-9ff3-5d9ece665e06"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    extra: {
      eas: {
        projectId: "bb176fef-733c-4258-9ff3-5d9ece665e06"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kimathii.framez",
      infoPlist: {
        UIViewControllerBasedStatusBarAppearance: true
      }
    },
    android: {
      package: "com.kimathii.framez",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000" // Changed to black
      },
      statusBar: {
        backgroundColor: "#000000",
        barStyle: "light-content"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app needs access to your photos to let you share images in posts."
        }
      ]
    ]
  }
};